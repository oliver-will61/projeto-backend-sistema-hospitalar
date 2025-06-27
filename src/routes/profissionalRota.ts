import express from 'express'
import {cadastro} from '../controllers/profissionalController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/cadastro', (req, res, next) => {
    cadastro(req, res).catch(next)});

export default router