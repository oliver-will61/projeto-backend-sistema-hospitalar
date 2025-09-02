import { tabela } from "../config/database"
import {ExameInput} from "../interfaces/ExameInput"
import { Request, Response } from "express"

export class Exame {

    nomeTabelaExame = tabela.exame

    static agendaExame (req: Request, res: Response) {
        try {
        
        const {emailPaciente, emailMedico, unidadeHospitalar,data, tipo, status}  = req.body as ExameInput
         
        } catch (error) {
            console.error(error)
            return res.json({
                message: "Erro ao marcar o exame" 
            })
        }
    }
}