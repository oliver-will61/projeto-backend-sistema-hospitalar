import {Usuario} from '../models/Usuario';
import {Request, Response} from 'express';
import { Paciente } from '../models/Paciente';


export const login =  async (req: Request, res: Response) => {
    Usuario.login(req, res, 'pacientes') // 3 argumento é o nome da tabela
}

export const cadastro =  async (req: Request, res: Response) => {
    Usuario.cadastro(req, res, 'pacientes');
};

export const marcarConsultaController = async(req: Request, res: Response) => {
    Paciente.marcarConsulta(req, res)
}

export const mostraConsultaController = async (req: Request, res: Response) => {
    Paciente.mostraConsulta(req, res, 'paciente')
}

export const excluiConsultaController = async(req: Request, res: Response) => {
    Paciente.excluiConsulta(req, res)
}