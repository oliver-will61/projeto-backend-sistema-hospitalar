import {Request, Response} from 'express';
import {Consulta} from '../models/Consulta'

export const marcarConsultaController = async(req: Request, res: Response) => {
    Consulta.marcarConsulta(req, res)
}

export const mostraTodasConsultasPacienteController = async (req: Request, res: Response) => {
    Consulta.mostraTodasConsultas(req, res, 'paciente')
}

export const mostraTodasConsultasMedicoController = async (req: Request, res: Response) => {
    Consulta.mostraTodasConsultas(req, res, 'medico')
}

export const excluiConsultaController = async(req: Request, res: Response) => {
    Consulta.excluiConsulta(req, res)
}

export const mostraConsultaController = async(req: Request, res: Response) => {
    Consulta.mostraConsulta(req, res)
}