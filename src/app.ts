// defini uma rota base

import express from 'express';
import path from 'path';
import pacienteRota from './routes/pacienteRota'


// cria instância do express
const app = express();  


app.use(express.json()); 

app.get('/pgCadastroPaciente', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'cadastro_paciente.html'));
});


app.use('/', pacienteRota);



export default app;