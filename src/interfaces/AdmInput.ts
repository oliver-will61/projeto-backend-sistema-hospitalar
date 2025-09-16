import { UsuarioInput } from "./UsuarioInput";

export interface AdmInput extends UsuarioInput {
    cargo: string,
    is_adm: boolean
    nomeUnidadeHospitalar: string
}

export interface AdmEstoque {
    nomeItem: string,
    quantidade: number,
    fornecedor: string,
    idUnidadeHospitalar: number
}