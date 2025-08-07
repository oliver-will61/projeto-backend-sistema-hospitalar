import {db} from '../config/database';
import { RowDataPacket } from "mysql2";

export class UnidadeHospitalar {

    constructor (public nome: string){
    }

    static async getId(nomeUnidadeHospitalar: string): Promise<number> {
        const [unidades] = await db.execute<RowDataPacket[]>(
            `SELECT id FROM unidade_hospitalar WHERE nome = ?`,
            [nomeUnidadeHospitalar]
        );

        if (!unidades || unidades.length === 0) {
            throw new Error ("Unidade hospitalar não encontrada!")
            
        }

        return unidades[0].id
    }
} 