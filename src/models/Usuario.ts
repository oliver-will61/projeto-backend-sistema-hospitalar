import {Request, Response} from 'express';
import {db, tabela} from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from "mysql2";
import { Consulta } from './Consulta';
import { Exame } from './Exame';
import { error } from 'console';

export class Usuario {

    static acesso = ''
    
    constructor(
        public cpf: string, public nome: string, public email: string, public senha: string, public telefone: string, 
        public genero: string, public idade: number) 
    {
        this.cpf = cpf;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.genero = genero;
        this.idade = idade; 
    }

    static async getId (emailUsuario: string, nomeTabela: string): Promise<number> {
            
        const [row] = await db.execute<RowDataPacket[]>(
            `SELECT id FROM ${nomeTabela} WHERE email = ?`,
            [emailUsuario]
        )

        if (!row || row.length === 0) {
            throw new Error ("email não encontrado")
        }

        return row[0].id
    }

    static async login(req: Request, res: Response, nomeTabela: string) {
            try {
                
                const {email, senha} = req.body 
                
                //busca usuario no banco
                const [rows] = await db.execute(
                    `SELECT * FROM ${nomeTabela} WHERE email = ?`, [email])
        
                const usuario = (rows as any)[0] //pega o primeiro usuario da consulta e tipa qualquer coisa (any)
        
                if(!usuario){
                    return res.status(404).json({
                        erro: 'Email não encontrado!'
                    });
                }
                
                // verifica senha
                const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
                if(!senhaValida) {
                    return res.status(401).json({erro:'Senha Inválida'
        
                    });
                }

                const token = jwt.sign(
                    {
                        id: usuario.id, 
                        email: usuario.email, 
                        usuario: usuario.nome,
                        is_adm: usuario.is_adm,
                        acesso: this.acesso
                    }, 
                    process.env.JWT_SECRET as string //pega a chave para validar o token
                );                
            
                return res.status(200).json({
                message: 'Login realizado com sucesso!',
                token: token
                });
        
                
            } catch (error) {
                console.error('Erro no login', error);
                return res.status(500).json({
                    erro: 'Email não encontrado'
                });
            }
    }

    static async cadastro(req: Request, res: Response, nomeTabela: String){
        try {

        
            const {cpf, nome, email, senha, telefone, genero, idade} = req.body as Usuario

            //verifica se o usuarop já possui cadastro

            const [row] = await db.execute<RowDataPacket[]>(`
                SELECT email FROM ${tabela.pacientes} WHERE email = ?`, 
                    [email]
            )

            if (row.length > 0) {
                return res.status(409).json({
                    mensagem: "Usuário já cadastrado!"
                })
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (cpf, nome, email, senha, telefone, genero, idade) VALUES (?,?,?,?,?,?,?)`,
                [cpf,nome,email,senhaCriptografada,telefone,genero,idade]
            )
            
            console.log("Paciente cadastrado com sucesso!"); //resposta de sucesso (backend)

            return res.status(201).json({
                message: 'Paciente cadastrado com sucesso!', //resposta de sucesso (frontend)
            });  
        
        } catch (error) {
            console.error('Erro no login', error);
            return res.status(500).json({
                message:"Erro ao cadastrar",
                error:error
            });
        }

    }

    static async exibeProntuario(req: Request, res: Response) {
        try {
            const prontuario = {
                consultas: await Consulta.puxaTodasConsultas(req, res, 'paciente'),
                exames: await Exame.puxaTodosExames(req, res, 'paciente')
            }

            return res.status(200).json({
                prontuario: prontuario 
            })
            
        } catch (error) {
            console.error(error)
            return res.json({
                mensagem: "Erro ao gerar o prontuario",
                errro: error 
            })
        }
    }
}