import { Medico } from "../models/Medico";
import {Request, Response} from 'express';

export const login = async (req: Request, res: Response) => {
    Medico.login(req, res, 'profissional')
}

export const mostraConsultaController = async (req: Request, res: Response) => {
    Medico.mostraConsulta(req, res, 'medico')
}

export const geraPrescricaoController = async (req: Request, res: Response) => {
    Medico.geraPrescricao(req, res)
}