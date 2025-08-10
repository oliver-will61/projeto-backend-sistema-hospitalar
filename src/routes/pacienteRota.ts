import express from 'express'
import {cadastro, login, marcarConsultaController,  mostraConsultaController} from '../controllers/pacienteController'
import { verificaToken } from '../middleware';

const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());


router.post('/cadastro', (req, res, next) => {
    cadastro(req, res).catch(next)
});

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)
});

router.post('/marcarConsulta',
    verificaToken, 
    (req, res, next) => {
        marcarConsultaController(req, res).catch(next)
    });

router.post('/mostraConsulta', 
    verificaToken, 
    (req, res, next) => {
        mostraConsultaController(req, res).catch(next)
    })

export default router