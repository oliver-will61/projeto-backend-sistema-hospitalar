
async function postLoginPaciente(event) {
    
    const profisionalEmail = document.getElementById("input-email")
    const pacienteSenha = document.getElementById("input-senha")
    const form = document.getElementById("form")


    // valida se todos os campos estão preenchidos
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    event.preventDefault()
    
    const profisionalLogin = {
        email: profisionalEmail.value,
        senha: pacienteSenha.value,
    }

    const response = await fetch('/profisional/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(profisionalLogin)
    })

    const data = await response.json();
    
    localStorage.setItem('token',data.token) // dados de login do usuário
    
    if (data.usuarioLogado){
        console.log('o usuario esta logado')
        
        //window.location.href="../html/paciente-pagina.html"


    } else {
        console.log(data.erro);
        
    }
}

