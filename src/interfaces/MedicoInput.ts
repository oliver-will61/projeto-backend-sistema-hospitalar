import { UsuarioInput } from "./UsuarioInput";

export interface MedicoInput extends UsuarioInput{
    registroMedico: String;
    especialidade: String;
    admin: Boolean;
    nomeUnidadeHospitalar: String
}