import express from 'express';
import path from 'path';

const router = express.Router();

// Rota para a página de cadastro
router.get('/pgCadastroPaciente', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'cadastro_paciente.html'));
});

router.get('/pglogin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'login_paciente.html'))
})

router.get('/painel/root', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'html', 'root', 'painel.html'))
})

export default router;