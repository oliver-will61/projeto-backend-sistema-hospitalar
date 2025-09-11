import {Request, Response} from 'express';
import {Usuario} from '../models/Usuario';

export const exibeProntuarioController = async (req: Request, res: Response) => {
    Usuario.exibeProntuario(req, res)
}