import {Request, Response} from 'express';
import {Exame} from '../models/Exame'

export const marcaExameController = async(req: Request, res: Response) => {
    Exame.agendaExame(req, res)
}

export const mostraTodosExamesPacienteController = async(req: Request, res: Response) => {
    Exame.mostraTodosExames(req, res, 'paciente')
}

export const mostraTodosExamesMedicoController = async(req: Request, res: Response) => {
    Exame.mostraTodosExames(req, res, 'medico')
}