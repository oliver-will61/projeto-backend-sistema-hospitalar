import {db} from '../config/database';
import { UnidadeHospitalarDb } from '../interfaces/unidadeHospitalar_db'

export class UnidadeHospitalar {

    constructor (public nome: string){
    }

    static async getID(nomeUnidadeHospitalar: string): Promise<number> {
        const [unidades] = await db.execute<UnidadeHospitalarDb[]>(
            `SELECT  id FROM unidade_hospitalar WHERE nome = ?`,
            [nomeUnidadeHospitalar]
        );

        if (!unidades || unidades.length === 0) {
            throw new Error ("Unidade hospitalar não encontrada!")
        }

        return unidades[0].id
    }
} 