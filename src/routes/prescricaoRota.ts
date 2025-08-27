import express from 'express';
import { verificaToken } from '../middleware';
import { getPrescricaoController } from '../controllers/prescricaoController';

const router = express.Router();
const app = express()

app.use(express.json());


router.get('/prescricao', 
    verificaToken, 

    (req, res, next) => {
        getPrescricaoController(req, res).catch(next)
    }
);

export default router