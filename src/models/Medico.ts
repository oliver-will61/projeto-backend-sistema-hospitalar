import {Request, Response} from 'express';
import { Usuario } from "./Usuario";
import {db} from '../config/database';
import bcrypt from 'bcrypt';
import {ProfissionalInput} from "../interfaces/ProfissionalInput" //interface

export class Profissional extends Usuario {
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

    static async cadastro(req: Request, res: Response, nomeTabela: String){
        try {
        
            const {cpf, nome, email, senha, telefone, genero, idade, registroMedico, 
                especialidade, admin} = req.body as ProfissionalInput

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            console.log(`Dados recebidos ${JSON.stringify(req.body)}`);

            console.log(cpf, nome, email, senha, telefone, genero, idade, registroMedico, 
                especialidade, admin);
            

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (cpf, nome, email, senha, telefone, genero, idade, registro_medico, especialidade, is_admin) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [cpf,nome,email,senhaCriptografada,telefone,genero,idade, registroMedico, especialidade, admin]
            )
            
            console.log("Paciente cadastrado com sucesso!"); //resposta de sucesso (backend)

            return res.status(201).json({
                message: 'Paciente cadastrado com sucesso!', //resposta de sucesso (frontend)
            });  
        
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message:"Erro ao cadastrar",
                error: (error as Error).message
            });
        }

    }
    
}


