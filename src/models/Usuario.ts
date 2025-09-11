import {Request, Response} from 'express';
import {db, tabela} from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from "mysql2";
import { UsuarioInput } from '../interfaces/UsuarioInput';
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

    static async exibeProntuario(req: Request, res: Response) {
        try {
            const {email} = req.body
            
            //pega o id do paciente usando como parametro o email
            const id = await Usuario.getId(email, tabela.pacientes) 

            const [rows] = await db.execute<RowDataPacket[]>( `
                
            SELECT
                -- Consulta
                c.id AS consulta_id,
                c.uuid AS consulta_uuid,
                c.data AS consulta_data,
                c.telemedicina AS consulta_telemedicina,
                c.status AS consulta_status,
                c.id_medico AS consulta_id_medico,
                c.id_unidade_hospitalar AS consulta_id_unidade,
                
                -- Prescrição
                pres.id AS prescricao_id,
                pres.codigo AS prescricao_codigo,
                pres.diagnostico,
                pres.receita,
                pres.autorizacao_exame,
                
                -- Exame
                e.id AS exame_id,
                e.data AS exame_data,
                e.tipo AS exame_tipo,
                e.status AS exame_status,
                e.id_unidade_hospitalar AS exame_id_unidade,
                
                -- Relacionamentos (JOINs)
                pac.nome AS paciente_nome,
                med.nome AS medico_nome,
                unid.nome AS unidade_nome
                
            FROM ${tabela.consultas} c 
            
            LEFT JOIN ${tabela.prescricao} pres ON c.id = pres.id_consulta
            LEFT JOIN ${tabela.exame} e ON pres.id = e.id_prescricao
            LEFT JOIN ${tabela.pacientes} pac ON c.id_paciente = pac.id
            LEFT JOIN ${tabela.profissionais} med ON c.id_medico = med.id
            LEFT JOIN ${tabela.unidadeHospitalar} unid ON c.id_unidade_hospitalar = unid.id`, 

                [id]
            )
        } catch (error) {
            console.error(error)
            return res.json({
                mensagem: "Erro ao gerar o prontuario",
                errro: error 
            })
        }
    }
}