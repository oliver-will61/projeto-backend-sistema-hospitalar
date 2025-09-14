import express from 'express'
import { verificaToken} from '../middleware';
import {teleconsultaController} from '../controllers/consultaController'


const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());

// marcaExame
router.get('/teleconsulta/:uuidConsulta',
    verificaToken,

    (req, res, next) => {
        teleconsultaController(req, res).catch(next)
    });

export default router