// defini uma rota base

import express from 'express';

// cria instância do express
const app = express();  


app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Servidor Typescript rodando');
});


export default app;