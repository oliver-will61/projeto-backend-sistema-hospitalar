import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
import { table } from 'console';

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
    pacientes: "pacientes"
} as const //garante a tipagem estatica