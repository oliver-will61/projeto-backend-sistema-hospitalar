// defini uma rota base

import express from 'express';
import path from 'path';

import pacienteRota from './routes/pacienteRota'
import pagesRota from './routes/pagesRota'

// cria instância do express
const app = express();  


// Middleware para arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json()); 


app.use('/', pagesRota)
app.use('/api', pacienteRota);



export default app;