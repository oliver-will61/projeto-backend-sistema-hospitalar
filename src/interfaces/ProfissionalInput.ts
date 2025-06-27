import { UsuarioInput } from "./UsuarioInput";

export interface ProfissionalInput extends UsuarioInput{
    registroMedico: String;
    especialidade: String;
    admin: Boolean;
}