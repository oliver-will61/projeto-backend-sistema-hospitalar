import express from 'express'
import {login} from '../controllers/medicoController';
import { verificaToken, isMedico } from '../middleware';
import {mostraTodosExamesMedicoController, cancelaExameController} from '../controllers/exameController'

const router = express.Router();
const app = express()

app.use(express.json());

router.get('/login', (req, res, next) => {
    login(req, res).catch(next)});

export default router