import express from 'express'
import { verificaToken} from '../middleware';
import {teleconsultaController, marcarConsultaController, mostraTodasConsultasPacienteController, 
    cancelaConsultaController, mostraTodasConsultasMedicoController, encerraConsultaController} from '../controllers/consultaController'
import { isPaciente, isMedico } from '../middleware';


const router = express.Router();


const app = express()
// Este middleware é ESSENCIAL para parsear o body das requisições
app.use(express.json());


// ## ROTAS PARA O PACIENTE ## ====================================================================
// marca consulta, apenas o paciente pode marcar a consulta
router.post('/',
    verificaToken, isPaciente,

    (req, res, next) => {
        marcarConsultaController(req, res).catch(next)
    });

// mostra as consultas do paciente
router.get('/paciente',
    verificaToken,  isPaciente,
    (req, res, next) => {
        mostraTodasConsultasPacienteController(req, res).catch(next)
    })

// cancela a consulta, apenas o paciente pode cancelar a consulta
router.put('/paciente/:uuid',
    verificaToken, isPaciente,
    (req, res, next) => {
        cancelaConsultaController(req, res).catch(next)
    } 
)

// ## ROTAS PARA O MEDICO =======================================================================

// mostra consultas
router.get('/medico',
    verificaToken,  isMedico,
    (req, res, next) => {
        mostraTodasConsultasMedicoController(req, res).catch(next)
    }
)

// encerra consulta
router.put('/medico/:uuid', 
    verificaToken, isMedico,
    (req, res, next) => {
        encerraConsultaController(req, res).catch(next)
    }
)


// acessa a teleconsulta
router.get('/teleconsulta/:uuidConsulta',
    verificaToken,

    (req, res, next) => {
        teleconsultaController(req, res).catch(next)
    });

export default router