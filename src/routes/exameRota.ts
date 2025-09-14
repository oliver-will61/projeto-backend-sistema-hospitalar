import express from 'express'
import {marcaExameController} from '../controllers/exameController'
import {mostraTodosExamesPacienteController, cancelaExameController} from '../controllers/exameController'
import { verificaToken, isPaciente} from '../middleware';

const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());

// marcaExame
router.post('/:codigoPrescricao',
    verificaToken, isPaciente,

    (req, res, next) => {
        marcaExameController(req, res).catch(next)
    }   
);


// ## ROTAS DO  PACIENTE ## =================================================================================================================================


// mostra os exames
router.get('/paciente', 
    verificaToken, isPaciente, 
    (req, res, next) => {
        mostraTodosExamesPacienteController(req, res).catch(next)
    }
)

// cancela o exame
router.put('/paciente/:uuid',
    verificaToken, isPaciente,
    (req, res, next) => {
        cancelaExameController(req, res).catch(next)
    } 
)

export default router