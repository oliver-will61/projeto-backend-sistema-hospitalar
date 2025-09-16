import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
import { customAlphabet } from 'nanoid'
import { RowDataPacket } from "mysql2";

dotenv.config();

export const db = mysql.createPool ({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// armazena os nome das tabelas do banco de dados em valores estáticos
export const tabela = {
    consultas: "consultas",
    profissionais: "profissional",
    pacientes: "pacientes",
    unidadeHospitalar: "unidade_hospitalar",
    prescricao: "prescricao",
    exame: "exames",
    consulta: "consultas",
    estoque: "estoque"
} as const //garante a tipagem estatica

//função para conveter BINARY16 para UUID string
export function binaryToUuidString(binaryBuffer: Buffer): string {

    // Converte o Buffer para string hexadecimal (sem hífens)
    const hex = binaryBuffer.toString('hex');

    // Formata com hífens nas posições corretas
    return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20)}`;
}


export async function geraCodigoNumerico(nomeTabela: string, nomeColuna: string, númeroDeDigitos: number) {
       
    try {

        const geradorDeCodigo = customAlphabet('123456789', númeroDeDigitos)

        while (true) {

            const codigo = geradorDeCodigo()

            const [row] = await db.execute<RowDataPacket[]>(`
                SELECT ${nomeColuna} FROM ${nomeTabela} WHERE ${nomeColuna} = ?`,
            [codigo])

            if(row.length === 0) {
                return codigo
            }

            console.log(`codigo ${codigo} já existe, tentando novamente...`);
            
        }

    } catch (error){
        console.error(error)
    }
}
