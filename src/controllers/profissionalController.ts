import { Profissional } from "../models/Profissional";
import {Request, Response} from 'express';


export const cadastro =  async (req: Request, res: Response) => { 
    console.log(req.body);
       
    Profissional.cadastro(req, res, 'profissional');
};