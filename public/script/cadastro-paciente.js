
function postCadastroPaciente() {
    const pacienteNome = document.getElementById("input-nome-completo")
    const pacienteCpf = document.getElementById("input-cpf")
    const pacienteEmail = document.getElementById("input-email")
    const pacienteSenha = document.getElementById("input-senha")
    const pacienteTelefone = document.getElementById("input-telefone")
    const pacienteGenero = document.getElementById("select-genero")
    const pacienteIdade = document.getElementById("input-idade");

    const paciente = {
        nome: pacienteNome.value,
        cpf: pacienteCpf.value,
        email: pacienteEmail.value,
        senha: pacienteSenha.value,
        telefone: pacienteTelefone.value,
        idade: pacienteIdade.value,
        genero: pacienteGenero.value
    }

    console.log(paciente);

    fetch('/paciente/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(paciente)
    })
}

