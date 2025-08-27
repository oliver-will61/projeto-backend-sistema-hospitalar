import { Usuario } from "./Usuario";
import { db, tabela } from "../config/database";
import { PrescricaoInput } from "../interfaces/prescricao_input";
import {Request, Response} from 'express';
import { RowDataPacket } from "mysql2";

export class Medico extends Usuario {

    static nomeTabela = tabela.profissionais;
    static acesso = "medico"

    constructor(
        cpf: string, nome: string, email: string, senha: string, telefone: string, 
        genero: string, idade: number, public registroMedico: String, public especialidade: String, 
        public admin:Boolean) 
    {

        super(cpf, nome, email, senha, telefone, genero, idade)

        this.registroMedico = registroMedico,
        this.especialidade = especialidade,
        this.admin = admin;
    }; 

    static async geraPrescricao(req: Request, res: Response, nomeTabelaPrescricao: string, nomeTabelaConsulta: string){

        try {
            
            const {diagnostico, receita, requisicao_exame} = req.body as PrescricaoInput 
            const  {uuid} = req.params

            const [consultaRow] = await db.execute<RowDataPacket[]>(
                    `SELECT id FROM ${nomeTabelaConsulta} WHERE uuid = UNHEX(REPLACE(?, '-', ''))`, 
                    [uuid]
            )

            if (consultaRow.length === 0) {
                throw new Error ("Consulta não encontrada!")
            }

            const consultaId = consultaRow[0].id

            const [resultado] = await db.execute(
                `
                INSERT INTO ${nomeTabelaPrescricao} (id_consulta, diagnostico, receita, autorizacao_exame) VALUE (?,?,?,?)`,
                [consultaId, diagnostico, receita, requisicao_exame]
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


