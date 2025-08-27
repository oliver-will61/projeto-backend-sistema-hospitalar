import express from 'express'
import {login} from '../controllers/medicoController';
import { verificaToken, isMedico } from '../middleware';
import { mostraConsultaController, mostraTodasConsultasController, geraPrescricaoController } from '../controllers/medicoController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});


router.post('/mostraTodasConsultas',
    verificaToken,  isMedico,
    (req, res, next) => {
        mostraTodasConsultasController(req, res).catch(next)
    })

router.post('/geraPrescricao/:uuid', 
    verificaToken, isMedico,
    (req, res, next) => {
        geraPrescricaoController(req, res).catch(next)
    }
)

router.get('/mostraConsulta/:uuid', 
    verificaToken, isMedico,
    (req, res, next) => {
        mostraConsultaController(req, res).catch(next)
    }
)

export default router