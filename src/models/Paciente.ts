export class Paciente implements Usuario{

    constructor(
        public cpf: string, public nome: string, public email: string, public senha: string, public telefone: string, 
        public genero: string)
    {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.genero = genero;
    }
}