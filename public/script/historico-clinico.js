function mostraFormulario(){
    const form = document.getElementById("form")
    form.style.display = 'block'
}

async function enviaDatabase(event) {

    event.preventDefault()
    
    const alergias = [document.querySelectorAll('input[name="alergias"]:checked')]
        .map(cb => cb.value);

        console.log(alergias);
        

    const doencas = [document.querySelectorAll('input[name="doencas"]:checked')]
    .map(cb => cb.value);

    console.log(doencas);
    

    const historico = {
        alergias: alergias,
        doencasCronicas: doencas
    };

    console.log(historico)

    const response = await fetch('/paciente/historico', {
        method:'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(historico)
    })

    const result = await response.json(); // mostra a resposta do servidor
    console.log(result);
    
}