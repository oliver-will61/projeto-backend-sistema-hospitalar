import { UsuarioInput } from "./UsuarioInput";

export interface AdmInput extends UsuarioInput {
    cargo: string,
    is_adm: boolean
    nomeUnidadeHospitalar: string
}