import express from 'express'
import {cadastrarPaciente} from '../controllers/cadastroController'
import {login} from '../controllers/loginController'
import {historicoClinicoPaciente} from '../controllers/pacienteHistoricoController'

const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());


router.post('/cadastroPaciente', (req, res, next) => {
    cadastrarPaciente(req, res).catch(next)});

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});

router.post('/historico', (req, res, next) => {
    historicoClinicoPaciente(req, res).catch(next)});

export default router