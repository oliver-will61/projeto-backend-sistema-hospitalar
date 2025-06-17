import {Request, Response} from 'express';
import {db} from '../config/database';
import {Paciente} from '../models/Paciente';

export const cadastrarPaciente =  async (req: Request, res: Response) => {

    try {
        
        const {cpf, nome, email, senha, telefone, genero, idade} = req.body as Paciente
        console.log(req.body);
        console.log(cpf);
        
        return res.status(201).json({
            message: 'Paciente cadastrado com sucesso!',
        });  
    } catch (error) {
        return res.status(500).json({
            message:"Erro ao cadastrar",
            error:error
        });
    }
};