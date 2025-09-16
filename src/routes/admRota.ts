import express from 'express'
import {login, cadastroAdm, cadastroMedico, controllerCadastroUnidade, 
    controllerCadastraNovosItensEstoque, controllerReporEstoque} from '../controllers/admController';
import {verificaToken, isAdmin} from "../middleware"

const router = express.Router();
const app = express()

app.use(express.json());

router.post('/login', (req, res, next) => {
    login(req, res).catch(next)
});

router.post('/cadastroAdm', 

    verificaToken,  // 1º: Verifica se o token é válido
    isAdmin,        // 2º: Verifica se o usuário é admin
    (req, res, next) => {

    cadastroAdm(req, res).catch(next)});


router.post('/cadastroMedico',
    verificaToken,  // 1º: Verifica se o token é válido
    isAdmin,        // 2º: Verifica se o usuário é admin
     (req, res, next) => {

        cadastroMedico(req, res).catch(next)
    }
);

router.post('/cadastroUnidade',
    verificaToken,
    isAdmin,
    (req, res, next) => {
        controllerCadastroUnidade(req, res).catch(next)
})


router.post('/estoque', 
    verificaToken,
    isAdmin,
    (req, res, next ) => {
        controllerCadastraNovosItensEstoque(req, res).catch(next)
    }
)


router.put('/estoque/:codigoItem', 
    verificaToken,
    isAdmin,
    (req, res, next ) => {
        controllerReporEstoque(req, res).catch(next)
    }
)



export default router