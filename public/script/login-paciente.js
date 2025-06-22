
async function postLoginPaciente(event) {
    
    const pacienteEmail = document.getElementById("input-email")
    const pacienteSenha = document.getElementById("input-senha")
    const form = document.getElementById("form")


    // valida se todos os campos estão preenchidos
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    event.preventDefault()
    
    const pacienteLogin = {
        email: pacienteEmail.value,
        senha: pacienteSenha.value,
    }

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(pacienteLogin)
    })

    const data = await response.json();

    if (data.usuarioLogado){
        console.log('o usuario esta logado')

        window.location.href="../html/paciente-pagina.html"


    } else {
        console.log(data.erro);
        
    }
}

