import { Request, Response } from "express";
import { tabela } from "../config/database";
import { db } from "../config/database";
import { RowDataPacket } from "mysql2";


export class Prescricao {

    static async mostraPrescricao(req: Request, res: Response, nomeTabela: string ) {
        try {

            const {uuidConsulta} = req.params            

            const [row] = await db.execute<RowDataPacket[]> (
                `
                    SELECT diagnostico, receita, autorizacao_exame

                    FROM ${tabela.prescricao} 

                    WHERE uuid_consulta = UUID_TO_BIN(?)
                `,
                [uuidConsulta]
            )

            const prescricao = (row as any)[0]

            if(!prescricao) {
                return res.status(404).json({
                    message: "UUID da consulta não encontrado"
                })
            }
            
            // para trocar o valor autorizacao_exame de 1 para "permitido"
            const prescricaoFormata = {
                ... prescricao, 
                    autorizacao_exame: prescricao.autorizacao_exame === 1 || prescricao.autorizacao_exame === true ? "Permitido" : "Não permitido"
            }

            res.status(200).json({
                message: "Prescrição Selecionada",
                data: prescricaoFormata,
            })

        } catch (error) {
            console.error(error)
            return 
        }
    }
}