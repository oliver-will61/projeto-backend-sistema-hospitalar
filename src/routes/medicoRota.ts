import express from 'express'
import {login} from '../controllers/medicoController';
import { verificaToken, isMedico } from '../middleware';
import {mostraTodosExamesMedicoController, cancelaExameController} from '../controllers/exameController'

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});

//EXAMES ============================================================

// mostra exame
router.get('/exame/', 
    verificaToken, isMedico, 
    (req, res, next) => {
        mostraTodosExamesMedicoController(req, res).catch(next)
    }
)

router.put('/exame/encerrar/:uuid', 
    verificaToken, isMedico,
    (req, res, next) => {
        cancelaExameController(req, res).catch(next)
    }
)


export default router