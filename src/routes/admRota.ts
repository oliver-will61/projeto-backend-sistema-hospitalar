import express from 'express'
import {cadastroAdm} from '../controllers/admController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/cadastro', (req, res, next) => {
    cadastroAdm(req, res).catch(next)});

export default router