import {Request, Response} from 'express';
import {db} from '../config/database';
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { error } from 'console';

export class Leito {

    static async getLeitoDisponível (res: Response){
        
        try{

        }

        catch (error) {
            console.error(error)
            res.status(404).json({
                mensagem: "Sem leitos disponíveis"
            })
        }

    } 

} 