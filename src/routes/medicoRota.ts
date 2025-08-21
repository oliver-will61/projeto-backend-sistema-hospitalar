import express from 'express'
import {login} from '../controllers/medicoController';
import { verificaToken, isMedico } from '../middleware';
import { mostraConsultaController, geraPrescricaoController } from '../controllers/medicoController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});


router.post('/mostraConsulta',
    verificaToken,  isMedico,
    (req, res, next) => {
        mostraConsultaController(req, res).catch(next)
    })

router.post('/geraPrescricao', 
    verificaToken, isMedico,
    (req, res, next) => {
        geraPrescricaoController(req, res).catch(next)
    }
)

export default router