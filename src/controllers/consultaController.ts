import {Request, Response} from 'express';
import {Consulta} from '../models/Consulta'
import { tabela } from '../config/database';

export const marcarConsultaController = async(req: Request, res: Response) => {
    Consulta.marcarConsulta(req, res)
}

export const mostraTodasConsultasPacienteController = async (req: Request, res: Response) => {
    Consulta.mostraTodasConsultas(req, res, 'paciente')
}

export const mostraTodasConsultasMedicoController = async (req: Request, res: Response) => {
    Consulta.mostraTodasConsultas(req, res, 'medico')
}

export const cancelaConsultaController = async(req: Request, res: Response) => {
    Consulta.cancela(req, res, tabela.consulta)
}

export const encerraConsultaController = async(req: Request, res: Response) => {
    Consulta.encerra(req, res, tabela.consulta)
}

export const teleconsultaController = async(req: Request, res: Response) => {
    Consulta.acessoTeleconsulta(req, res)
}
