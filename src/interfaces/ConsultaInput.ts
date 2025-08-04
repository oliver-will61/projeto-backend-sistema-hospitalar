export interface ConsultaInput{
    emailPaciente: string, 
    emailMedico: string,
    unidadeHospitalar: string,
    dia:Date
    hora: number,
    telemedicina: boolean,
    status: string
    diagnostico: string
}
