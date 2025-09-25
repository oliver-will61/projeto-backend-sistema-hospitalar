import express from 'express'
import {cadastro, login} from '../controllers/pacienteController'

const router = express.Router();

const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());

router.post('/cadastro', (req, res, next) => {
    cadastro(req, res).catch(next)
});

router.get('/login', (req, res, next) => {
    login(req, res).catch(next)
});

export default router