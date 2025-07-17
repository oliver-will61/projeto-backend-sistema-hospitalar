import express from 'express'
import {cadastroAdm, cadastroMedico} from '../controllers/admController';

const router = express.Router();
const app = express()

app.use(express.json());




router.post('/cadastroAdm', (req, res, next) => {
    console.log("Encontrou a rota");
    
    cadastroAdm(req, res).catch(next)});

router.post('/cadastroMedico', (req, res, next) => {

    cadastroMedico(req, res).catch(next)});

export default router