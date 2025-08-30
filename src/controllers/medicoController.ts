import { Medico } from "../models/Medico";
import {Request, Response} from 'express';

import { tabela } from "../config/database";

export const login = async (req: Request, res: Response) => {
    Medico.login(req, res, 'profissional')
}

export const mostraTodasConsultasController = async (req: Request, res: Response) => {
    Medico.mostraTodasConsultas(req, res, 'medico')
}

export  const mostraConsultaController = async (req: Request, res: Response) => {
    Medico.mostraConsulta(req, res)
}