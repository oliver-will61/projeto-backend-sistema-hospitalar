import express from 'express'
import {login} from '../controllers/medicoController';
import { verificaToken, isMedico } from '../middleware';
import {mostraTodasConsultasMedicoController} from '../controllers/consultaController';
import {mostraTodosExamesMedicoController} from '../controllers/exameController'

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});

router.post('/mostraTodasConsultas',
    verificaToken,  isMedico,
    (req, res, next) => {
        mostraTodasConsultasMedicoController(req, res).catch(next)
    })

router.get('/exame/', 
    verificaToken, isMedico, 
    (req, res, next) => {
        mostraTodosExamesMedicoController(req, res).catch(next)
    }
)

export default router