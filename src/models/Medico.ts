import { Usuario } from "./Usuario";
import { db, tabela } from "../config/database";
import { PrescricaoInput } from "../interfaces/prescricao_input";
import {Request, Response} from 'express';

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

    static async geraPrescricao(req: Request, res: Response){

        try {
            
            const {diagnostico, receita, requisicao_exame} = req.body as PrescricaoInput 

            const [resultado] = await db.execute(
                `INSERT INTO ${nomeTabela} (diagnostico, receita, autorizacao_exame) VALUE (?,?,?)`,
                [diagnostico, receita, requisicao_exame]
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


