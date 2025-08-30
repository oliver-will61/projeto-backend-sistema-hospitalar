import { Usuario } from "./Usuario";
import {tabela} from "../config/database";


export class Medico extends Usuario {

    static nomeTabela = tabela.profissionais;
    static acesso = "medico"

    constructor(
        cpf: string, nome: string, email: string, senha: string, telefone: string, 
        genero: string, idade: number, public registroMedico: String, public especialidade: String, 
        public admin:Boolean) 
    {

        super(cpf, nome, email, senha, telefone, genero, idade)

        this.registroMedico = registroMedico,
        this.especialidade = especialidade,
        this.admin = admin;
    }; 

}
