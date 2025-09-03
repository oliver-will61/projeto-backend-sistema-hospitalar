import { Request, Response } from "express";
import { tabela } from "../config/database";
import { db } from "../config/database";
import { RowDataPacket } from "mysql2";
import { PrescricaoInput } from "../interfaces/prescricao_input";

// biblioteca responsável por gerar código aleatorios
import { customAlphabet } from 'nanoid'

export class Prescricao {

    private nomeTabelaPrescricao = tabela.prescricao

    static async geraCodigo(nomeTabela: string) {

        try {

            const geradorDeCodigo = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

            while (true) {

                const codigo = geradorDeCodigo()

                const [row] = await db.execute<RowDataPacket[]>(`
                    SELECT codigo FROM ${nomeTabela} WHERE codigo = ?`,
                [codigo])

                if(row.length === 0) {
                    return codigo
                }

                console.log(`codigo ${codigo} já existe, tentando novamente...`);
                
            }

        } catch (error){
            console.error(error)
        }
    }


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

    static async geraPrescricao(req: Request, res: Response, nomeTabelaPrescricao: string, nomeTabelaConsulta: string){

    try {
        
        const {diagnostico, receita, requisicao_exame} = req.body as PrescricaoInput 
        const  {uuidConsulta} = req.params

        const [consultaRow] = await db.execute<RowDataPacket[]>(
                `SELECT id FROM ${nomeTabelaConsulta} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`, 
                [uuidConsulta]
        )

        if (consultaRow.length === 0) {
            throw new Error ("Consulta não encontrada!")
        }

        const consultaId = consultaRow[0].id

        const codigoPrescricao = await Prescricao.geraCodigo(nomeTabelaPrescricao)
                
        const [resultado] = await db.execute(
            `
            INSERT INTO ${nomeTabelaPrescricao} (id_consulta, uuid_consulta, diagnostico, receita, autorizacao_exame, codigo) VALUE (?,UUID_TO_BIN(?),?,?,?,?)`,
            [consultaId, uuidConsulta, diagnostico, receita, requisicao_exame, codigoPrescricao]
        ) 
        
        return res.json({message: "Prescrição gerada com sucesso!"})


    } catch (error) {
        console.error(error)
        return res.status(500).json({
        message:"Erro ao gerar a prescrição",
        error:error
        });
    }

}

}