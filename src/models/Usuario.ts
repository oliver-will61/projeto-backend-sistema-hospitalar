import {Request, Response} from 'express';
import {db} from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from "mysql2";
import { ConsultaInput } from '../interfaces/ConsultaInput';
import {tabela, binaryToUuidString} from '../config/database'
import { Paciente } from './Paciente';

type TipoAcesso = 'medico' | 'paciente';

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

                console.log(this.acesso);
                
                
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

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            console.log(JSON.stringify(req.body, null, 2));


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

    

    static async mostraConsulta(req: Request, res: Response, acesso:TipoAcesso) {

        console.log(acesso);
        
        try {
            const {email} = req.body as ConsultaInput    

            const idConfig = {
                paciente: {
                    nomeColunaDb: tabela.pacientes 
                },

                medico: {
                    nomeColunaDb: tabela.profissionais 
                }
            }
            console.log(acesso);
            console.log(idConfig[acesso]);
            
            console.log(`Nome da tabela é: ${idConfig[acesso].nomeColunaDb}`);

            //pega o id do paciente usando como parametro o email
            const id = await Usuario.getId(email, idConfig[acesso].nomeColunaDb) 

            

            // define as variações de query e parametros com base no tipo de acesso
            const queryConfig = {
                paciente: {
                    query: `
                        -- p = profisionais, c = consulta, u = unidade

                        SELECT
                        p.nome AS nome_medico,
                        u.nome AS nome_unidade,

                        c.data,
                        c.telemedicina,
                        c.uuid

                        FROM ${tabela.consultas} c 
                        
                        LEFT JOIN ${tabela.profissionais} p ON c.id_medico = p.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id

                        WHERE c.id_paciente = ? AND c.status = ?`, 

                    params: [id, "agendado"] as const
                },

                medico: {
                    query: `
                        -- p = profisionais, c = consulta, u = unidade

                        SELECT
                        p.nome AS nome_paciente,
                        u.nome AS nome_unidade,

                        c.data,
                        c.telemedicina,
                        c.uuid

                        FROM ${tabela.consultas} c 
                        
                        LEFT JOIN ${tabela.profissionais} p ON c.id_paciente = p.id   

                        LEFT JOIN ${tabela.unidadeHospitalar} u ON c.id_unidade_hospitalar = u.id

                        WHERE c.id_medico = ? AND c.status = ?`, 

                    params: [id, "agendado"] as const
                }
            }

            //verifiaca se o acesso é valido
            if (!(acesso in queryConfig)) {
                return res.status(400).json({message: "Tipo de acesso inválido"})
            }

            const [rows] = await db.execute<RowDataPacket[]>(
                queryConfig[acesso].query, queryConfig[acesso].params
                
            )

            //principal  função é converte o uuid que está em binario para string com a função "binaryToUuidString()"
            const queryFormatada = rows.map(row => ({
                ...row, 
                uuid: binaryToUuidString(row.uuid)
            }));
                
                
            return res.json({
                data: queryFormatada,
                message: "Todas as consultas agendadas"      
            })
        
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro a realizar a consulta"
            })
            
        }
    }

}