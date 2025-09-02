import {tabela, binaryToUuidString} from "../config/database"  
import {Request, Response} from 'express';
import {db} from '../config/database';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ConsultaInput } from '../interfaces/ConsultaInput';
import { Usuario } from "./Usuario";
import { UnidadeHospitalar } from "./UnidadeMedica";
import  {v4 as uuidv4} from 'uuid' //biblioteca responsável por gerar os uuid
import { error } from "console";

type TipoAcesso = 'medico' | 'paciente';

export class Consulta {
    private nomeTabelaConsulta = tabela.consulta 

    static async mostraTodasConsultas(req: Request, res: Response, acesso:TipoAcesso) {
        
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
                        -- p = profisionais, c = consulta, u = unidade

                        SELECT
                        p.nome AS nome_medico,
                        u.nome AS nome_unidade,

                        c.id,
                        c.uuid,
                        c.data,
                        c.telemedicina

                        FROM ${tabela.consultas} c 
                        
                        LEFT JOIN ${tabela.profissionais} p ON c.id_medico = p.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id

                        WHERE c.id_paciente = ? AND c.status = ?`, 

                    params: [id, "agendado"] as const
                },

                medico: {
                    query: `
                        -- p = profisionais, c = consulta, u = unidade

                        SELECT
                        p.nome AS nome_paciente,
                        u.nome AS nome_unidade,

                        c.data,
                        c.telemedicina,
                        c.uuid

                        FROM ${tabela.consultas} c 
                        
                        LEFT JOIN ${tabela.profissionais} p ON c.id_paciente = p.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id

                        WHERE c.id_medico = ? AND c.status = ?`, 

                    params: [id, "agendado"] as const
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
                ...row, 
                uuid: binaryToUuidString(row.uuid),
                telemedicina: row.telemedicina === 1 || row.telemedicina == true ? "Sim" : "Não"

            }));
                
            return res.json({
                data: queryFormatada,
                message: "Todas as consultas agendadas"      
            })
        
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro a realizar a consulta"
            })
        }
    }

    static async mostraConsulta(req: Request, res: Response) {
        try {
            const {uuid} = req.params 

            const [result] = await db.execute<RowDataPacket[]>(
            `
                SELECT 
                p.nome  as nome_paciente,
                m.nome as nome_medico,
                u.nome as nome_unidade,

                c.id,
                c.uuid,
                c.data,
                c.telemedicina
 
                FROM ${tabela.consultas} c
                
                LEFT JOIN ${tabela.pacientes} p ON c.id_paciente = p.id
                LEFT JOIN ${tabela.profissionais} m ON c.id_medico = m.id
                LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id
                
                WHERE uuid = UNHEX(REPLACE(?, '-', ''))
                `, 
            [uuid]
            )

            const consulta = (result as any)[0]
            
            if(!consulta) {
                return res.status(404).json({
                    message: "UUID não encontrado"
                })
            }
            
            //principal  função é converte o uuid que está em binario para string com a função "binaryToUuidString()"
            const consultaFormatada =  {
                ...consulta, 
                uuid: binaryToUuidString(consulta.uuid),
                telemedicina: consulta.telemedicina === 1 || consulta.telemedicina == true ? "Sim" : "Não"
            }
         

            res.status(200).json({
                message: "Consulta Selecionada",
                consultaData: consultaFormatada
            })

        } catch (error) {
            console.error(error)
        }
    }

    static async marcarConsulta(req:Request, res: Response) {

        try {
            const {emailPaciente, emailMedico, unidadeHospitalar, data, telemedicina, 
                status} = req.body as ConsultaInput
            
            //pega o id do médico usadno como parametro o email
            const idMedico = await Usuario.getId(emailMedico, tabela.profissionais) 

            //pega o id do paciente usando como parametro o email
            const idPaciente = await Usuario.getId(emailPaciente, tabela.pacientes) 

            //pega o id unidade hospitalar usadno como parametro o nome da unidade
            const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)
            
            let statusVar = status
            if (statusVar != "agendado") {
                throw new Error ("Valor de status inesperado!")
            }

            // trás as consultas do paciente que tem como status "agendado"
            const [row] = await db.execute<RowDataPacket[]>(
                `SELECT data, id_medico, status FROM ${tabela.consultas} WHERE id_medico = ? AND status = ? AND data = ?` ,
                [idMedico, status, data]
            )

            if (row.length > 0) {                
                    throw new Error ("Já existe um consulta marcada para o horario escolhido!")
             }

             //Gera o UUID
             const uuid = uuidv4();
             
            //marca a consulta no banco de dados
            const [resultado] = await db.execute(
                `INSERT INTO ${tabela.consultas} (id_paciente, id_medico, id_unidade_hospitalar, data, telemedicina, status, uuid) VALUES (?,?,?,?,?,?, UUID_TO_BIN(?))`,
                [idPaciente, idMedico, idUnidadeHospitalar, data, telemedicina, status, uuid]
            )

            console.log("Consulta realizada com sucesso!");
            
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

    static async excluiConsulta(req: Request, res: Response){
        try {
            const {uuid} = req.params // Ou req.body.uuid se enviar no corpo
            
            //realiza a exclusão   
            // //ResultSetHeader seria o equivalente do RowDataPacket só para o DELETE
            const [result] = await db.execute<ResultSetHeader>(
                `DELETE FROM ${tabela.consultas} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`, 
                [uuid]
            )

            //verifica se a linha foi afetada
            if (result.affectedRows === 0){
                return res.status(404).json({
                    message: "UUID não encontrado"
                })
            }

            res.status(200).json({
                message: "Registro excluido com sucesso"
            });

        } catch (error) {
            console.error("Erro ao excluir", error)
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
        }
    }
}

