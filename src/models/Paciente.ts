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
                status} = req.body as ConsultaInput
            
            //pega o id do médico usadno como parametro o email
            const idMedico = await Medico.getId(emailMedico, "profissional")

            //pega o id do paciente usando como parametro o email
            const idPaciente = await Paciente.getId(emailPaciente, "pacientes") 

            //pega o id unidade hospitalar usadno como parametro o nome da unidade
            const idUnidadeHospitalar = await UnidadeHospitalar.getId(unidadeHospitalar)
            
            let statusVar = status
            if (statusVar != "agendado") {
                throw new Error ("Valor de status inesperado!")
            }

            // trás as consultas do paciente que tem como status "agendado"
            const [row] = await db.execute(
                `SELECT data, id_medico, status FROM ${nomeTabelaConsulta} WHERE id_medico = ? AND status = ? AND data = ?` ,
                [idMedico, status, data]
            )

            //console.log(row);
            

            if (row.length > 0) {                

                // talvez a parte de baixo nem seja necessário
                // converte a data do input e do banco de dados em timestamp para facilitar a comparação das duas datas
            //     const dataInputTimestamp = new Date(data).getTime()
            //     const dataBancoTimestamp = new Date(row[0].data).getTime()
                
            //     //vefifica se já não existe um agendamento para a mesma data
            //     if (dataBancoTimestamp == dataInputTimestamp) {
                    throw new Error ("Já existe um consulta marcada para o horario escolhido!")
            //     }
             }
        

            //marca a consulta no banco de dados
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
                message: "Erro ao marca a consulta, verificar o servidor"
            })
        }
    }
}

