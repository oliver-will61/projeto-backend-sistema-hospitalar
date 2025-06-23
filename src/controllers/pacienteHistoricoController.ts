import {Request, Response} from 'express';
import {db} from '../config/database';

export const historicoClinicoPaciente = async (req: Request, res: Response) => {
    
    try{
        const historico = req.body 
        console.log(historico);
        
    }

    catch(erro) {
        console.error(erro);
        return
    }
}