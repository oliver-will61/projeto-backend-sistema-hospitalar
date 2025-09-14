// defini uma rota base

import express from 'express';
import path from 'path';

import pacienteRota from './routes/pacienteRota'
import pagesRota from './routes/pagesRota'
import medicoRota from './routes/medicoRota'
import admRota from './routes/admRota'
import prescricaoRota from './routes/prescricaoRota';
import exameRota from './routes/exameRota';
import prontuarioRota from './routes/prontuarioRota'
import consultaRota from './routes/consultaRota'

// cria instância do express
const app = express();  


// Middleware para arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json()); 

app.use('/page', pagesRota)
app.use('/paciente', pacienteRota);
app.use('/medico', medicoRota)
app.use('/adm', admRota)
app.use('/prescricao', prescricaoRota)
app.use('/exame', exameRota)
app.use('/consulta', consultaRota)
app.use('/prontuario', prontuarioRota)


export default app;