import { Medico } from "../models/Medico";
import { Adm } from "../models/Adm";
import {Request, Response} from 'express';

export const cadastroAdm =  async (req: Request, res: Response) => { 
    
    Adm.cadastroAdm(req, res, 'profissional');
};

export const cadastroMedico =  async (req: Request, res: Response) => { 
    
    Adm.cadastroMedico(req, res, 'profissional');
};