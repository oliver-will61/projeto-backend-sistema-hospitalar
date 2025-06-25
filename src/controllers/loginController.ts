import {Request, Response} from 'express';
import {db} from '../config/database';
import {Paciente} from '../models/Paciente';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login =  async (req: Request, res: Response) => {
 
    try {
        
        const {email, senha} = req.body 

        const [rows] = await db.execute(
            'SELECT * FROM pacientes WHERE email = ?', [email])

        const paciente = (rows as any)[0] //pega o primeiro paciente da consulta e tipa qualquer coisa (any)

        if(!paciente){
            return res.status(404).json({
                erro: 'Email não encontrado!'
            });
        }
        
        const senhaValida = await bcrypt.compare(senha, paciente.senha);

        if(!senhaValida) {
            return res.status(401).json({erro:'Senha Inválida'

            });
        }

        const token = jwt.sign(
            {
                id: paciente.id, 
                email: paciente.email, 
                paciente: paciente.nome
            }, 
            process.env.JWT_SECRET as string //pega a chave para validar o token
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            usuarioLogado: true,
            token: token
        });
        
    } catch (error) {
        console.error('Erro no login', error);
        return res.status(500).json({
            erro: 'Email não encontrado'
        });
    }
}