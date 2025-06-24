import {Request, Response} from 'express';
import {db} from '../config/database';

export const historicoClinicoPaciente = async (req: Request, res: Response) => {
    
    try{

        const  {alergia, doencaCronica} = req.body

        console.log(req.body);
        

        const alergiaJson = JSON.stringify(alergia)
        const doencaCronicaJson = JSON.stringify(doencaCronica)


        console.log(alergiaJson);
        console.log(doencaCronicaJson);
        
        

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