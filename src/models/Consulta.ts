import {tabela, binaryToUuidString} from "../config/database"  
import {Request, Response} from 'express';
import {db} from '../config/database';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ConsultaInput } from '../interfaces/ConsultaInput';
import { Usuario } from "./Usuario";
import { UnidadeHospitalar } from "./UnidadeMedica";
import  {v4 as uuidv4} from 'uuid' //biblioteca responsável por gerar os uuid

type TipoAcesso = 'medico' | 'paciente';

export class Consulta {
    private nomeTabelaConsulta = tabela.consulta 

    static async puxaTodasConsultas(req: Request, res: Response, acesso:TipoAcesso) {

        try {
            const {email} = req.body as ConsultaInput    

            const idConfig = {
                paciente: {
                    nomeColunaDb: tabela.pacientes 
                },

                medico: {
                    nomeColunaDb: tabela.profissionais 
                }
            }

            //pega o id do paciente usando como parametro o email
            const id = await Usuario.getId(email, idConfig[acesso].nomeColunaDb) 

            

            // define as variações de query e parametros com base no tipo de acesso
            const queryConfig = {
                paciente: {
                    query: `
                        -- p = profisionais, c = consulta, u = unidade, pres = prescricao, pac = paciente

                        SELECT
                        pac.nome AS nome_paciente,
                        p.nome AS nome_medico,
                        u.nome AS nome_unidade,

                        c.id,
                        c.uuid,
                        c.data,
                        c.telemedicina,
                        c.status,

                        pres.codigo,
                        pres.diagnostico,
                        pres.receita,
                        pres.autorizacao_exame

                        FROM ${tabela.consultas} c 
                        
                        LEFT JOIN ${tabela.profissionais} p ON c.id_medico = p.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id

                        LEFT JOIN ${tabela.prescricao} pres ON c.id = pres.id_consulta

                        LEFT JOIN ${tabela.pacientes} pac ON c.id_paciente = pac.id


                        WHERE c.id_paciente = ?`, 

                    params: [id] as const
                },

                medico: {
                    query: `
                        -- p = profisionais, c = consulta, u = unidade, pres = prescricao, pac = paciente

                        SELECT
                        pac.nome AS nome_paciente,
                        p.nome AS nome_medico,
                        u.nome AS nome_unidade,

                        c.id,
                        c.uuid,
                        c.data,
                        c.telemedicina,
                        c.status,

                        pres.codigo,
                        pres.diagnostico,
                        pres.receita,
                        pres.autorizacao_exame

                        FROM ${tabela.consultas} c 
                        
                        LEFT JOIN ${tabela.profissionais} p ON c.id_paciente = p.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id

                        LEFT JOIN ${tabela.prescricao} pres ON c.id = pres.id_consulta

                        LEFT JOIN ${tabela.pacientes} pac ON c.id_paciente = pac.id

                        WHERE c.id_medico = ?`, 

                    params: [id] as const
                }
            }

            //verifiaca se o acesso é valido
            if (!(acesso in queryConfig)) {
                return res.status(400).json({message: "Tipo de acesso inválido"})
            }

            const [rows] = await db.execute<RowDataPacket[]>(
                queryConfig[acesso].query, queryConfig[acesso].params
                
            )

            //principal  função é converte o uuid que está em binario para string com a função "binaryToUuidString()"
            const queryFormatada = rows.map(row => ({

                nome_paciente: row.nome_paciente,
                nome_medico: row.nome_medico,
                nome_unidade: row.nome_unidade,
                id: row.id,
                uuid: binaryToUuidString(row.uuid),
                data: row.data,
                telemedicina: row.telemedicina === 1 || row.telemedicina == true ? "Sim" : "Não",
                status: row.status,
                prescricao: {
                        codigo: row.codigo,
                        diagnostico: row.diagnostico,
                        receita:row.receita,
                        autorizacao_para_exame: row.autorizacao_exame === 1 || row.autorizacao_exame == true ? true : false
                }
            }));

            return queryFormatada
        }   
        catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao puxar as consultas"
            })
        }
    } 

    static async mostraTodasConsultas(req: Request, res: Response, acesso:TipoAcesso) {

        try {
            const consultas = await Consulta.puxaTodasConsultas(req, res, acesso)  

            return res.json({
                data: consultas,
                message: "Todas as consultas agendadas"      
            })
        }

        catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro a realizar ao mostrar as consultas"
            })
        }
    }
    
    static async marcarConsulta(req:Request, res: Response) {

        try {
            const {emailPaciente, emailMedico, unidadeHospitalar, data, telemedicina} = req.body as ConsultaInput
            
            //pega o id do médico usadno como parametro o email
            const idMedico = await Usuario.getId(emailMedico, tabela.profissionais) 

            //pega o id do paciente usando como parametro o email
            const idPaciente = await Usuario.getId(emailPaciente, tabela.pacientes) 

            //pega o id unidade hospitalar usadno como parametro o nome da unidade
            const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)
            
            const status = 'agendado';
            
            // trás as consultas do paciente que tem como status "agendado"
            const [row] = await db.execute<RowDataPacket[]>(
                `SELECT data, id_medico, status FROM ${tabela.consultas} WHERE id_medico = ? AND status = ? AND data = ?` ,
                [idMedico, status, data]
            )

            if (row.length > 0) {                
                    throw new Error ("Já existe uma consulta marcada para o horario escolhido!")
             }

             //Gera o UUID
             const uuid = uuidv4();
             
            //marca a consulta no banco de dados
            const [resultado] = await db.execute(
                `INSERT INTO ${tabela.consultas} (id_paciente, id_medico, id_unidade_hospitalar, data, telemedicina, status, uuid) VALUES (?,?,?,?,?,?, UUID_TO_BIN(?))`,
                [idPaciente, idMedico, idUnidadeHospitalar, data, telemedicina, status, uuid]
            )
            
            return res.status(201).json({
                message: "Consulta Realizada com Sucesso!"
            });

        } catch (error){
            console.error(error)
            return res.json({
                message: "Erro ao marca a consulta, verificar o servidor"
            })
        }
    }

    static async cancela(req: Request, res: Response, tabela: string){
        try {
            const {uuid} = req.params // Ou req.body.uuid se enviar no corpo
            
            //realiza a exclusão   
            // //ResultSetHeader seria o equivalente do RowDataPacket só para o DELETE
            const [result] = await db.execute<ResultSetHeader>(
                `UPDATE ${tabela} 
                SET status = "cancelado" 
                WHERE uuid = UNHEX(REPLACE(?, '-', ''))` , 
                [uuid]
            )

            //verifica se a linha foi afetada
            if (result.affectedRows === 0){
                return res.status(404).json({
                    message: "UUID não encontrado"
                })
            }

            res.status(200).json({
                message: "Registro cancelado com sucesso"
            });

        } catch (error) {
            console.error("Erro ao cancelar", error)
            return res.status(500).json({
                mensagem: "Erro ao realizar o cancelamento!"
            })
        }
    }

    static async geraCodigo(nomeTabela: string) {

        try {
            while (true) {
                const codigo = Math.floor(100000 + Math.random() * 900000);

                const [row] = await db.execute<RowDataPacket[]>(`
                    SELECT codigo from ${nomeTabela} WHERE codigo = ${codigo}
                    `)

                if(row.length === 0) {
                    return codigo
                }

                console.log(`codigo ${codigo} já existe, tentando novamente...`);
                
            }

        } catch (error){
            console.error(error)
            throw new Error ("Falha ao gerar o codigo único");
        }
    }

    static async encerra(req: Request, res: Response, nomeTabela: string, tipoDoAtendimento: string) {
        try {

            const {uuid} = req.params

            if(tipoDoAtendimento == 'consulta') {

                // verifica se tem prescricao

                const [codigo] = await db.execute<RowDataPacket[]>(
                    `SELECT codigo from ${tabela.prescricao} WHERE uuid_consulta = UNHEX(REPLACE(?, '-', ''))`, 
                    [uuid])

                
                if(codigo[0] == null) {
                    return res.status(404).json({
                        menssage: "Por favor escrever a prescrição do exame"
                    })
                }

                if(codigo.length === 0){
                    return res.status(404).json({
                        mensagem: "UUID não encontrado"
                    })
                }
            }


            const [result] = await db.execute<ResultSetHeader>(
                `UPDATE ${nomeTabela} 
                SET status = "realizado" 
                WHERE uuid = UNHEX(REPLACE(?, '-', ''))` , 
                [uuid]
            )

            return res.status(200).json({
                menssage: "Atendimento Finalizado"
            })

        } catch(error) {
            console.error(error)
            return res.json({
                menssagem: "Erro ao encerrar!"
            })
        } 
    } 

    static async acessoTeleconsulta (req: Request, res: Response) {
        try {
            const {uuidConsulta} = req.params 

             const [row] = await db.execute<RowDataPacket[]>(`

                SELECT telemedicina, status from ${tabela.consulta} WHERE uuid = UUID_TO_BIN(?)`, 
                    [uuidConsulta]
            )

            //verifica se encontrou a consulta
            if(row.length === 0) {
                return res.status(404).json({
                    mensage: "Consulta não encontrada!"
                })
            }            

            // verifica se a consulta já foi atendida pelo status
            if(row[0].status != "agendado"){
                return res.status(401).json({
                    mensage: "Consulta não está mais disponível!"
                })         
            }

            //verifica se é a consulta é uma teleconsulta
            if(row[0].telemedicina != 1 || row[0].telemedicina != true) {
                return res.status(401).json({
                    mensage: "Consulta não é uma teleconsulta!"
                })            
            }

            return res.status(200).json({
                mensagem: "conectando teleconsulta..."
            }) 
        }

        catch(error) {
            console.log(error);
            return res.status(501).json({
                mensagem: "Erro ao entrar na teleconsulta!"
            })
        }
    }    
}



