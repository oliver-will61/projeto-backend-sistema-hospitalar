import {Request, Response} from 'express';
import { Paciente } from '../models/Paciente';
import { tabela } from '../config/database';

export const login =  async (req: Request, res: Response) => {
    Paciente.login(req, res, tabela.pacientes) // 3 argumento é o nome da tabela
}

export const cadastro =  async (req: Request, res: Response) => {
    Paciente.cadastro(req, res, tabela.pacientes);
};
