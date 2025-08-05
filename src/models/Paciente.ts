import {ConsultaInput} from "../interfaces/ConsultaInput"
import { Request, Response } from "express";
import { Usuario } from "./Usuario";
import { Medico } from "./Medico";
import { UnidadeHospitalar } from "./UnidadeMedica";
import { db } from "../config/database";

export class Paciente extends Usuario {


    static async marcarConsulta(req:Request, res: Response) {

        const nomeTabelaConsulta = "consultas" 

        try {
            const {emailPaciente, emailMedico, unidadeHospitalar, data, telemedicina, 
                status, diagnostico} = req.body as ConsultaInput

            const idPaciente = await Paciente.getId(emailPaciente, "pacientes") 
            const idMedico = await Medico.getId(emailMedico, "profissional")
            const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)

            console.log(idPaciente, idMedico, idUnidadeHospitalar)

            const [resultado] = await db.execute(
                `INSERT INTO ${nomeTabelaConsulta} (id_paciente, id_medico, id_unidade_hospitalar, data, telemedicina, status) VALUES (?,?,?,?,?,?)`,
                [idPaciente, idMedico, idUnidadeHospitalar, data, telemedicina, status]
            )

            console.log("Consulta realizada com sucesso!");
            
            return res.status(201).json({
                message: "Consulta Realizada com Sucesso!"
            });

        } catch (error){
            console.error(error)
            return res.json({
                message: "Erro ao marca a consulta, verifique se o email do medico/paciente ou a unidade hospitalar estão corretos"
            })
        }
    }
}

