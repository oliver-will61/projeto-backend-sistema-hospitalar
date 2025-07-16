import express from 'express'
import {cadastro, login} from '../controllers/medicoController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/cadastro', (req, res, next) => {
    cadastro(req, res).catch(next)});

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});

export default router