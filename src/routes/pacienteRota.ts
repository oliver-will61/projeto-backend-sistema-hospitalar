import express from 'express'
import {cadastro, login} from '../controllers/pacienteController'
import {marcarConsultaController, mostraTodasConsultasPacienteController, cancelaConsultaController} from '../controllers/consultaController'
import { verificaToken, isPaciente} from '../middleware';
import {mostraTodosExamesPacienteController, cancelaExameController} from '../controllers/exameController'

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

export default router