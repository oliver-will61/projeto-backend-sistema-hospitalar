import {Request, Response} from 'express';
import {Paciente} from '../models/Paciente';

export const cadastrarPaciente =  async (req: Request, res: Response) => {
    
    try {
        const paciente: Paciente = req.body

        console.log('Dados recebidos', paciente);


        return res.status(201).json({
            message: 'Paciente cadastrado com sucesso!',
            paciente: paciente
        });  
    } catch (error) {
        return res.status(500).json({
            message:"Erro ao cadastrar",
            error:error
        });
    }
   


};