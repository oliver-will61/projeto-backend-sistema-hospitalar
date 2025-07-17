import express from 'express'
import {login, cadastroAdm, cadastroMedico} from '../controllers/admController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)
});

router.post('/cadastroAdm', (req, res, next) => {
    
    cadastroAdm(req, res).catch(next)});

router.post('/cadastroMedico', (req, res, next) => {

    cadastroMedico(req, res).catch(next)});

export default router