import {Request, Response} from 'express';
import { Paciente } from '../models/Paciente';
import { tabela } from '../config/database';


export const login =  async (req: Request, res: Response) => {
    Paciente.login(req, res, tabela.pacientes) // 3 argumento é o nome da tabela
}

export const cadastro =  async (req: Request, res: Response) => {
    Paciente.cadastro(req, res, tabela.pacientes);
};

export const marcarConsultaController = async(req: Request, res: Response) => {
    Paciente.marcarConsulta(req, res)
}

export const mostraTodasConsultasController = async (req: Request, res: Response) => {
    Paciente.mostraTodasConsultas(req, res, 'paciente')
}

export const excluiConsultaController = async(req: Request, res: Response) => {
    Paciente.excluiConsulta(req, res)
}

export const mostraConsultaController = async(req: Request, res: Response) => {
    Paciente.mostraConsulta(req, res)
}