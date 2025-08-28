import { Request, Response } from "express";
import { tabela } from "../config/database";
import { db } from "../config/database";
import { RowDataPacket } from "mysql2";


export class Prescricao {

    static async mostraPrescricao(req: Request, res: Response, nomeTabela: string ) {
        try {

            const {idConsulta} = req.params

            const [row] = await db.execute<RowDataPacket[]> (
                `
                    SELECT 
                    p.id_consulta
                    p.diagnostico, 
                    p.receita, 
                    p.autorizacao_exame, 

                    pac.nome as nome_paciente,
                    pro.nome as nome_medico,
                    u.nome as nome_unidade,
                    
                    FROM ${tabela.prescricao} p

                    INNER JOIN ${tabela.consultas} c ON p.id_consulta = c.id
                    INNER JOIN ${tabela.pacientes} pac ON  c.id_paciente = pac.id
                    INNER JOIN ${tabela.profissionais} pro ON  c.id_medico = pro.id
                    INNER JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade =  u.id

                    WHERE id_consulta = ?
                `,
                [idConsulta]
            )

            const prescricao = (row as any)[0]

            if(prescricao) {
                return res.status(404).json({
                    message: "ID da consulta não encontrado"
                })
            }

            res.status(200).json({
                message: "Prescrição Selecionada",
                data: prescricao
            })

        } catch (error) {
            console.error(error)
            return 
        }
    }
}