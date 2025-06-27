import {Usuario} from '../models/Usuario';
import {Request, Response} from 'express';


export const login =  async (req: Request, res: Response) => {
    Usuario.login(req, res, 'pacientes') // 3 argumento é o nome da tabela
}

export const cadastro =  async (req: Request, res: Response) => {
    Usuario.cadastro(req, res, 'pacientes');
};