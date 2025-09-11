import express from 'express';
import { verificaToken } from '../middleware';
import { exibeProntuarioController} from '../controllers/usuarioController';
const router = express.Router();
const app = express()

app.use(express.json());

router.get('/',
    verificaToken,
    (req, res, next) => {
        exibeProntuarioController(req, res).catch(next)
    }
)

export default router