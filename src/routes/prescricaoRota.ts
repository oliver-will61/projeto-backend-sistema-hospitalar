import express from 'express';
import { verificaToken } from '../middleware';
import { getPrescricaoController, postPrescricaoController } from '../controllers/prescricaoController';
import { isMedico } from '../middleware';

const router = express.Router();
const app = express()

app.use(express.json());


router.get('/:uuidConsulta', 
    verificaToken, 

    (req, res, next) => {
        getPrescricaoController(req, res).catch(next)
    }
);

router.post('/:uuidConsulta', 
    //apenas o medico pode  gerar a prescrição
    verificaToken, isMedico,
    (req, res, next) => {
        postPrescricaoController(req, res).catch(next)
    }
)

export default router