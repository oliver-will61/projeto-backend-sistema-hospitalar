
async function postLoginPaciente(event) {
    
    const pacienteEmail = document.getElementById("input-email")
    const pacienteSenha = document.getElementById("input-senha")

    event.preventDefault()
    
    const pacienteLogin = {
        email: pacienteEmail.value,
        senha: pacienteSenha.value,
    }

    console.log(pacienteLogin);

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
    } else {
        console.log(data.erro);
        
    }
}

