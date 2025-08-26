import express from 'express'
import {cadastro, login, marcarConsultaController, mostraConsultaController, mostraTodasConsultasController, excluiConsultaController} from '../controllers/pacienteController'
import { verificaToken, isPaciente} from '../middleware';

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
    verificaToken, isPaciente,

    (req, res, next) => {
        marcarConsultaController(req, res).catch(next)
    });

router.post('/mostraTodasConsultas',
    verificaToken,  isPaciente,
    (req, res, next) => {
        mostraTodasConsultasController(req, res).catch(next)
    })

router.get('/mostraConsulta/:uuid',
    verificaToken, isPaciente,
    (req, res, next) => {
        mostraConsultaController(req, res).catch(next)
    }
)

router.delete('/excluiConsulta/:uuid',
    verificaToken, isPaciente,
    (req, res, next) => {
        excluiConsultaController(req, res).catch(next)
    } 
)

export default router