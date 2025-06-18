
function postLoginPaciente() {
    const pacienteEmail = document.getElementById("input-email")
    const pacienteSenha = document.getElementById("input-senha")


    const pacienteLogin = {
        email: pacienteEmail.value,
        senha: pacienteSenha.value,
    }

    console.log(pacienteLogin);

    fetch('/api/loginPaciente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(pacienteLogin)
    })
}

