import { Profissional } from "../models/Profissional";
import {Request, Response} from 'express';


export const cadastro =  async (req: Request, res: Response) => { 
    
    Profissional.cadastro(req, res, 'profissional');
};

export const login = async (req: Request, res: Response) => {
    Profissional.login(req, res, 'profissional')
}