const form = document.getElementById("form")


function mostraFormulario(){
    form.style.display = 'block'
}

async function enviaDatabase(event) {

    event.preventDefault()

    const formData = new FormData(form)

    const alergia = formData.getAll('alergias')

    const doenca = formData.getAll('doencas')
    
    const historico = {
        alergia: alergia,
        doencaCronica: doenca
    };

    const response = await fetch('/paciente/historico', {
        method:'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(historico)
    })

    const result = await response.json(); // mostra a resposta do servidor
    console.log(result);
    
}