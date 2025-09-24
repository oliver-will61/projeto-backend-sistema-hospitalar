import express from 'express'
import {marcaExameController} from '../controllers/exameController'
import {mostraTodosExamesPacienteController, cancelaExameController, mostraTodosExamesMedicoController, encerraExameController} from '../controllers/exameController'
import { verificaToken, isPaciente, isMedico} from '../middleware';

const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());

// marcaExame
router.post('/paciente/:codigoPrescricao',
    verificaToken, isPaciente,

    (req, res, next) => {
        marcaExameController(req, res).catch(next)
    }   
);


// ## ROTAS DO PACIENTE ## =================================================================================================================================


// mostra os exames paciente
router.get('/paciente', 
    verificaToken, isPaciente, 
    (req, res, next) => {
        mostraTodosExamesPacienteController(req, res).catch(next)
    }
)

// cancela o exame, apenas o paciente pode cancelar os exames
router.put('/paciente/:uuid',
    verificaToken, isPaciente,
    (req, res, next) => {
        cancelaExameController(req, res).catch(next)
    } 
)

// ## ROTAS DO MEDICO ## =================================================================================================================================

// mostra exame medico
router.get('/medico', 
    verificaToken, isMedico, 
    (req, res, next) => {
        mostraTodosExamesMedicoController(req, res).catch(next)
    }
)

// encerra os examas, apenas o medico pode encerrar os exames
router.put('/medico/:uuid', 
    verificaToken, isMedico,
    (req, res, next) => {
        encerraExameController(req, res).catch(next)
    }
)

export default router