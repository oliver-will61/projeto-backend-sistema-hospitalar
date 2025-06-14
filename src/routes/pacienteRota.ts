import express from 'express'
import {cadastrarPaciente} from '../controllers/pacienteController'

const router = express.Router();

router.post('/cadastroPaciente', (req, res, next) => {
    cadastrarPaciente(req, res).catch(next)});

export default router