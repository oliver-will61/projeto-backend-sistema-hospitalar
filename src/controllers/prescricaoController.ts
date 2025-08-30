import {Request, Response} from 'express';
import { tabela } from '../config/database';
import { Prescricao } from '../models/Prescricao';


export const getPrescricaoController =  async (req: Request, res: Response) => {
    Prescricao.mostraPrescricao(req, res, tabela.prescricao) // 3 argumento é o nome da tabela
}

export const postPrescricaoController = async (req: Request, res: Response) => {
    Prescricao.geraPrescricao(req, res, tabela.prescricao, tabela.consultas)
}
