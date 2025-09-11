import {Request, Response} from 'express';
import {Exame} from '../models/Exame'
import {tabela} from '../config/database'

export const marcaExameController = async(req: Request, res: Response) => {
    Exame.agendaExame(req, res)
}

export const mostraTodosExamesPacienteController = async(req: Request, res: Response) => {
    Exame.mostraTodosExames(req, res, 'paciente')
}

export const mostraTodosExamesMedicoController = async(req: Request, res: Response) => {
    Exame.mostraTodosExames(req, res, 'medico')
}

export const cancelaExameController = async(req: Request, res: Response) => {
    Exame.cancela(req, res, tabela.exame)
}