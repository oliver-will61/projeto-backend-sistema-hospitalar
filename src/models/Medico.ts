import {Request, Response} from 'express';
import { Usuario } from "./Usuario";
import {db} from '../config/database';
import bcrypt from 'bcrypt';
import {MedicoInput} from "../interfaces/MedicoInput" //interface

export class Medico extends Usuario {
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

