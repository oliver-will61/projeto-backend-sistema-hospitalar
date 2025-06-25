import {Request, Response} from 'express';
import {db} from '../config/database';
import jwt from 'jsonwebtoken';

export const historicoClinicoPaciente = async (req: Request, res: Response) => {
    
    try{
        
        const token = req.headers.authorization?.split(' ')[1];
        const dados = jwt.verify(token, process.env.JWT_SECRET)

        console.log(dados)

        const  {alergia, doencaCronica} = req.body

        console.log(req.body);
        

        const alergiaJson = JSON.stringify(alergia)
        const doencaCronicaJson = JSON.stringify(doencaCronica)        

        const [result] = await db.execute(
            'INSERT INTO historico_clinico (alergia, doenca_cronica) VALUES (?,?)',
            [alergiaJson, doencaCronicaJson]
        )

        console.log('Dados enviados para o banco');
        

        res.status(201).json({
            sucesso: true,
            mensage: 'Enviados com sucesso ao banco'
        })
        
    }

    catch(error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ success: false, error: 'Erro ao salvar histórico' });
    }
}