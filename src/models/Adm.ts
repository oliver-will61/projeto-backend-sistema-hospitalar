import {Request, Response} from 'express';
import { Usuario } from "./Usuario";
import {db} from '../config/database';
import bcrypt from 'bcrypt';
import {MedicoInput} from "../interfaces/MedicoInput" //interface
import {AdmInput} from "../interfaces/AdmInput" //interface
import {UnidadeHospitalarInput} from "../interfaces/UnidadeHospitalarInput"

export class Adm extends Usuario {
    constructor(
        cpf: string, nome: string, email: string, senha: string, telefone: string, 
        genero: string, idade: number, public cargo: string, public is_adm:Boolean) 
    {

        super(cpf, nome, email, senha, telefone, genero, idade)

        this.cargo = cargo;
        this.is_adm = is_adm;

    };

    static async cadastroAdm(req: Request, res: Response, nomeTabela: String) {
        try {
            const {cpf, nome, email, senha, telefone, genero, cargo, idade, is_adm} = req.body as AdmInput

            const senhaCriptografada = await bcrypt.hash(senha, 10)

            console.log(`Dados recebidos ${JSON.stringify(req.body)}`);

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (cpf, nome, email, senha, telefone, genero, cargo, idade, is_adm) VALUE (?,?,?,?,?,?,?,?,?)`,
                 [cpf, nome, email, senhaCriptografada, telefone, genero, cargo, idade, is_adm] 
            )

            console.log("Administrador cadastrado com sucesso!");

            return res.status(201).json({
                message: 'Administrador cadastrado com sucesso!', //resposta de sucesso (frontend)
            });  

        } catch(error) {
            console.error(error)
            return res.status(500).json({
                message:"Erro ao cadastrar",
                error: (error as Error).message
            })
        }        
    }

    static async cadastroMedico(req: Request, res: Response, nomeTabela: String){
        try {
        
            const {cpf, nome, email, senha, telefone, genero, idade, registroMedico, 
                especialidade, admin} = req.body as MedicoInput

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            // console.log(cpf, nome, email, senha, telefone, genero, idade, registroMedico, 
            //     especialidade, admin);
            

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (cpf, nome, email, senha, telefone, genero, idade, registro_medico, especialidade, is_admin) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                [cpf,nome,email,senhaCriptografada,telefone,genero,idade, registroMedico, especialidade, admin]
            )
            
            console.log("Medico cadastrado com sucesso!"); //resposta de sucesso (backend)

            return res.status(201).json({
                message: 'Medico cadastrado com sucesso!', //resposta de sucesso (frontend)
            });  
        
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message:"Erro ao cadastrar",
                error: (error as Error).message
            });
        }
    }

    static async cadastroUnidade(req: Request, res: Response, nomeTabela: String) {
        
        try {
            const {
                cnpjUnidade, ruaUnidade, numeroUnidade, bairroUnidade, estadoUnidade, cepUnidade
            } = req.body as UnidadeHospitalarInput

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (cnpj, nome_rua, numero_rua, bairro, estado, cep) VALUES (?,?,?,?,?,?)`,
                [cnpjUnidade, ruaUnidade, numeroUnidade, bairroUnidade, estadoUnidade, cepUnidade]
            )

            console.log("Unidade cadastrada com sucesso")

            return res.status(201).json({
                message: "Unidade cadastrada com sucesso"
            });
        } catch(error) {
            console.error(error)
            return res.status(500).json({
                message: "Erro ao cadastra a unidade",
                error: (error as Error).message
            })
        }
    }
}
