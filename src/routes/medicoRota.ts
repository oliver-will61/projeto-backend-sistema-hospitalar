import express from 'express'
import {login} from '../controllers/medicoController';

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)});

export default router