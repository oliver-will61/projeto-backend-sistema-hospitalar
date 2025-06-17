import express from 'express'
import {cadastrarPaciente} from '../controllers/pacienteController'

const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());


router.post('/cadastroPaciente', (req, res, next) => {
    cadastrarPaciente(req, res).catch(next)});

export default router