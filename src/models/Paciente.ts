import { Usuario } from "./Usuario";
import { tabela } from "../config/database";

export class Paciente extends Usuario {

    static nomeTabela = tabela.pacientes
    static acesso = "paciente"

}

