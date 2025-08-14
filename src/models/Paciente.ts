import {ConsultaInput} from "../interfaces/ConsultaInput"
import { Request, Response } from "express";
import { Usuario } from "./Usuario";
import { Medico } from "./Medico";
import { UnidadeHospitalar } from "./UnidadeMedica";
import { db } from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { tabela } from "../config/database";
import {binaryToUuidString} from "../config/database"
import  {v4 as uuidv4} from 'uuid' //biblioteca responsável por gerar os uuid

export class Paciente extends Usuario {

    static nomeTabela = tabela.pacientes
    
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
}

