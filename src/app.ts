// defini uma rota base

import express from 'express';
import path from 'path';

import pacienteRota from './routes/pacienteRota'
import pagesRota from './routes/pagesRota'
import profissionalRota from './routes/profissionalRota'

// cria instância do express
const app = express();  


// Middleware para arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json()); 


app.use('/page', pagesRota)
app.use('/paciente', pacienteRota);
app.use('/profissional', profissionalRota)



export default app;