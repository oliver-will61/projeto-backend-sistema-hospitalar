export class unidadeHospitalar {
    constructor(
        public cnpj: string, 
        public nomeRua: string,
        public numeroRua: number,
        public bairro: string,
        public estado: string,
        public cep: string
    ) {

    this.cnpj = cnpj
    this.nomeRua = nomeRua
    this.numeroRua = numeroRua
    this.bairro = bairro
    this.estado = estado;
    this.cep = cep;
    }
}