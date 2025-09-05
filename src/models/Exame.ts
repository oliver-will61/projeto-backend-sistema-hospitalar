import { db, tabela } from "../config/database"
import {ExameInput} from "../interfaces/ExameInput"
import { Request, Response } from "express"
import { Usuario } from "./Usuario"
import { UnidadeHospitalar } from "./UnidadeMedica"
import  {v4 as uuidv4} from 'uuid' //biblioteca responsável por gerar os uuid
import {RowDataPacket} from 'mysql2'

export class Exame {

    static nomeTabelaExame = tabela.exame

    static async agendaExame (req: Request, res: Response) {
        try {
        
        //verifica se tem permição para realizar o exame
        const {codigoPrescricao} = req.params

        const [codigo] = await db.execute<RowDataPacket[]>(`
                SELECT codigo FROM ${tabela.prescricao} WHERE codigo = ?
            `, [codigoPrescricao])

        if(codigo.length === 0) {
            return res.status(404).json({
                mensage: "Codigo de prescrição não encontrado!"
            })
        }


        const {emailPaciente, emailMedico, unidadeHospitalar,data, tipo, status}  = req.body as ExameInput

        //pega o id do médico usadno como parametro o email
        const idMedico = await Usuario.getId(emailMedico, tabela.profissionais) 

        //pega o id do paciente usando como parametro o email
        const idPaciente = await Usuario.getId(emailPaciente, tabela.pacientes) 

        //pega o id unidade hospitalar usadno como parametro o nome da unidade
        const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)

        //Gera o UUID
        const uuid = uuidv4();

        
        const [result] = await db.execute(`
            INSERT INTO ${Exame.nomeTabelaExame} (id_unidade_hospitalar, id_paciente, id_medico, uuid, data, tipo, status) VALUES (?,?,?,UUID_TO_BIN(?),?,?,?)`,
            [idUnidadeHospitalar, idPaciente, idMedico, uuid, data, tipo, status])

        console.log("Consulta agendada com sucesso!");


        return res.status(201).json({
            messagem: "Consulta agendada com sucesso!"
        })
        

        } catch (error) {
            console.error(error)
            return res.json({
                message: "Erro ao marcar o exame" 
            })
        }
    }
}