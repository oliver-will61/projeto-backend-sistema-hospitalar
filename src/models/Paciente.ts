import {ConsultaInput} from "../interfaces/ConsultaInput"
import { Request, Response } from "express";
import { Usuario } from "./Usuario";
import { Medico } from "./Medico";
import { UnidadeHospitalar } from "./UnidadeMedica";
import { db } from "../config/database";

export class Paciente extends Usuario {


    async marcarConsulta(req:Request, res: Response) {

        const nomeTabelaConsulta = "consultas" 

        try {
            const {emailPaciente, emailMedico, unidadeHospitalar, data, telemedicina, 
                status, diagnostico} = req.body as ConsultaInput

            const idPaciente = Paciente.getId(emailPaciente, "pacientes") 
            const idMedico = Medico.getId(emailMedico, "Profissional")
            const idUnidadeHospitalar = UnidadeHospitalar.getId(unidadeHospitalar)

            const [resultado] = await db.execute(
                `INSERT INTO ${nomeTabelaConsulta} (id_paciente, id_medico, id_unidade_hospitalar, data, telemedicina, status, diagnostico) VALUES (?,?,?,?,?,?,?)`,
                [idPaciente, idMedico, idUnidadeHospitalar, data, telemedicina, status, diagnostico]
            )

            console.log("Consulta realizada com sucesso!");
            
            return res.status(201).json({
                message: "Consulta Realizada com Sucesso!"
            });

        } catch (errror){
            console.error()
        }
    }
}

