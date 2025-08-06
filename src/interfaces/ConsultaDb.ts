import { RowDataPacket } from "mysql2";

export interface ConsultaDb extends RowDataPacket{
    id_medico: number,
    data: Date,
    status: string
}