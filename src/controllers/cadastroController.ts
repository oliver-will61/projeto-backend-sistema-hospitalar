import {Request, Response} from 'express';
import {db} from '../config/database';
import {Paciente} from '../models/Paciente';
import bcrypt from 'bcrypt';


export const cadastrarPaciente =  async (req: Request, res: Response) => {

    try {
        
        const {cpf, nome, email, senha, telefone, genero, idade} = req.body as Paciente

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        console.log(`Dados recebidos ${req.body}`);

        const [resultado] = await db.execute (
            'INSERT INTO pacientes (cpf, nome, email, senha, telefone, genero, idade) VALUES (?,?,?,?,?,?,?)',
            [cpf,nome,email,senhaCriptografada,telefone,genero,idade]
        )
        
        console.log("Paciente cadastrado com sucesso!"); //resposta de sucesso (backend)

        return res.status(201).json({
            message: 'Paciente cadastrado com sucesso!', //resposta de sucesso (frontend)
        });  
        
    } catch (error) {
        return res.status(500).json({
            message:"Erro ao cadastrar",
            error:error
        });
    }
};