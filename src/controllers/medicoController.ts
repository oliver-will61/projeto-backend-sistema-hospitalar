import { Medico } from "../models/Medico";
import {Request, Response} from 'express';

export const login = async (req: Request, res: Response) => {
    Medico.login(req, res, 'profissional')
}