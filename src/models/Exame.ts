import { db, tabela } from "../config/database"
import {ExameInput} from "../interfaces/ExameInput"
import { Request, Response } from "express"
import { Usuario } from "./Usuario"
import { UnidadeHospitalar } from "./UnidadeMedica"
import  {v4 as uuidv4} from 'uuid' //biblioteca responsável por gerar os uuid
import {RowDataPacket} from 'mysql2'
import {binaryToUuidString} from '../config/database'
import { Consulta } from "./Consulta"

type TipoAcesso = 'medico' | 'paciente';

export class Exame extends Consulta {

    static nomeTabelaExame = tabela.exame

    static async agendaExame (req: Request, res: Response) {
        try {
        
        //verifica se tem permição para realizar o exame
        const {codigoPrescricao} = req.params

        const [codigo] = await db.execute<RowDataPacket[]>(`
                SELECT codigo, autorizacao_exame FROM ${tabela.prescricao} WHERE codigo = ?`, 
                [codigoPrescricao])

        if(codigo.length === 0) {
            return res.status(404).json({
                mensage: "Codigo de prescrição não encontrado!"
            })
        }

        console.log(codigo[0].autorizacao_exame);

        if (!codigo[0].autorizacao_exame) {
            return res.status(403).json({
                menssage: "Sem autorização para marcar o exame"
            })
        }
        


        const {emailPaciente, emailMedico, unidadeHospitalar,data, tipo, status}  = req.body as ExameInput

        //pega o id do médico usadno como parametro o email
        const idMedico = await Usuario.getId(emailMedico, tabela.profissionais) 

        //pega o id do paciente usando como parametro o email
        const idPaciente = await Usuario.getId(emailPaciente, tabela.pacientes) 

        //pega o id unidade hospitalar usadno como parametro o nome da unidade
        const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)

        // trás os exames que o medico tem marcado no horario solitado pelo paciente e vericica se o horário está disponível.
        const [row] = await db.execute<RowDataPacket[]>(
            `SELECT data, id_medico, status FROM ${Exame.nomeTabelaExame} WHERE id_medico = ? AND status = ? AND data = ?` ,
            [idMedico, status, data]
        )

        //se o resultado for maio que 0, signifca que existe um horário marcada naquele dia e hora
        if (row.length > 0) {
                return res.status(409).json({
                    message: "Já existe um exame marcado para o horário escolhido!"
                })                
            }

        //Gera o UUID para os exames
        const uuid = uuidv4();

        
        const [result] = await db.execute(`
            INSERT INTO ${Exame.nomeTabelaExame} (id_unidade_hospitalar, id_paciente, id_medico, uuid, data, tipo, status) VALUES (?,?,?,UUID_TO_BIN(?),?,?,?)`,
            [idUnidadeHospitalar, idPaciente, idMedico, uuid, data, tipo, status])

        return res.status(201).json({
            messagem: "Exame agendado com sucesso!"
        })
        
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: "Erro ao marcar o exame" 
            })
        }
    }

    static async mostraTodosExames(req: Request, res: Response, acesso:TipoAcesso) {
        
        try {
            const {email} = req.body as ExameInput    

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
                        p.nome AS nome_paciente,
                        m.nome AS nome_medico,
                        u.nome AS nome_unidade,

                        e.id,
                        e.uuid,
                        e.data,
                        e.tipo

                        FROM ${tabela.exame} e 

                        LEFT JOIN ${tabela.pacientes} p ON e.id_paciente = p.id 
                        
                        LEFT JOIN ${tabela.profissionais} m ON e.id_medico = m.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON e.id_unidade_hospitalar = u.id

                        WHERE e.id_paciente = ?`, 

                    params: [id] as const
                },

                medico: {
                    query: `
                        -- p = profisionais, c = consulta, u = unidade

                        SELECT
                        p.nome AS nome_paciente,
                        m.nome AS nome_medico,
                        u.nome AS nome_unidade,

                        e.data,
                        e.tipo,
                        e.uuid

                        FROM ${tabela.exame} e 
                        
                        LEFT JOIN ${tabela.pacientes} p ON e.id_paciente = p.id 

                        LEFT JOIN ${tabela.profissionais} m ON e.id_medico = m.id  

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON e.id_unidade_hospitalar = u.id

                        WHERE e.id_medico = ?`, 

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
                ...row, 
                uuid: binaryToUuidString(row.uuid),
            }));
                
            return res.json({
                data: queryFormatada,
                message: "Todas os exames agendados"      
            })
        
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro a realizar a consulta"
            })
        }
    }
}