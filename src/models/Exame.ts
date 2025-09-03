import { db, tabela } from "../config/database"
import {ExameInput} from "../interfaces/ExameInput"
import { Request, Response } from "express"
import { Usuario } from "./Usuario"
import { UnidadeHospitalar } from "./UnidadeMedica"

export class Exame {

    static nomeTabelaExame = tabela.exame

    static async agendaExame (req: Request, res: Response) {
        try {
        
        //verifica se tem permição para realizar o exame
        const {codigoPrescricao} = req.params


        const {emailPaciente, emailMedico, unidadeHospitalar,data, tipo}  = req.body as ExameInput

        //pega o id do médico usadno como parametro o email
        const idMedico = await Usuario.getId(emailMedico, tabela.profissionais) 

        //pega o id do paciente usando como parametro o email
        const idPaciente = await Usuario.getId(emailPaciente, tabela.pacientes) 

        //pega o id unidade hospitalar usadno como parametro o nome da unidade
        const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)

        
        const [result] = await db.execute(`
            INSERT INTO ${Exame.nomeTabelaExame} (id_unidade_hospitalar, id_paciente, id_medico, data, tipo, status) VALUES (?,?,?,?,?,?)`,
            [idUnidadeHospitalar, idPaciente, idMedico, data, tipo])

        console.log("Consulta agendada com sucesso!");
        

        } catch (error) {
            console.error(error)
            return res.json({
                message: "Erro ao marcar o exame" 
            })
        }
    }
}