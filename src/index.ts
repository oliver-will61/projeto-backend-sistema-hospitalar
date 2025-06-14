import { text } from 'stream/consumers';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

// defina a porta do servidor, se não encontrar no arquivo .env por padrão será 3000
const PORT: number = Number(process.env.PORT) || 3000;

// define o ip do servidor, se não encontrar no arquivo .env por padrão será  'localhost'
const HOST: string =  String(process.env.HOST) || 'localhost';


app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em no endereço ${HOST}:${PORT}`)
})