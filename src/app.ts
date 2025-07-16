// defini uma rota base

import express from 'express';
import path from 'path';

import pacienteRota from './routes/pacienteRota'
import pagesRota from './routes/pagesRota'
import medicoRota from './routes/medicoRota'
import admRota from './routes/admRota'

// cria instância do express
const app = express();  


// Middleware para arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json()); 


app.use('/page', pagesRota)
app.use('/paciente', pacienteRota);
app.use('/medico', medicoRota)
app.use('/adm,', admRota)



export default app;