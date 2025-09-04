import {Request, Response} from 'express';
import {Exame} from '../models/Exame'

export const marcaExameController = async(req: Request, res: Response) => {
    Exame.agendaExame(req, res)
}