import {ConsultaInput} from "../interfaces/ConsultaInput"
import { Request, Response } from "express";
import { Usuario } from "./Usuario";

export class Paciente extends Usuario {


    marcarConsulta(req:Request, res: Response) {

        try {
            const {emailPaciente, emailMedico, unidadeHospitalar, data, telemedicina, status, diagnostico} = req.body as ConsultaInput
        } catch (errror){
            console.error()
        }
    }
}

