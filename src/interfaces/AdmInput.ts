import { UsuarioInput } from "./UsuarioInput";

export interface AdmInput extends UsuarioInput {
    cargo: String,
    is_adm: boolean
}