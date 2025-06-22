
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

    if (response.ok){
        console.log(data.message)

        pacienteEmail.value = '' //deixa os campos dos inputs vázios
        pacienteSenha.value = ''//deixa os campos dos inputs vázios


    } else {
        console.log(data.erro);
        
    }
}

