import {Request, Response} from 'express';
import { Usuario } from "./Usuario";
import {db, tabela} from '../config/database';
import bcrypt from 'bcrypt';
import {MedicoInput} from "../interfaces/MedicoInput" //interface
import {AdmInput, AdmEstoque} from "../interfaces/AdmInput" //interface
import {UnidadeHospitalarInput} from "../interfaces/UnidadeHospitalarInput"
import { UnidadeHospitalar } from './UnidadeMedica';
import {geraCodigoNumerico} from '../config/database'
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { error } from 'console';
import { stat } from 'fs';

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
            const {nomeUnidadeHospitalar, cpf, nome, email, senha, telefone, genero, cargo, idade, is_adm} = req.body as AdmInput

            const senhaCriptografada = await bcrypt.hash(senha, 10)

            const idUnidadeHospitalar = await UnidadeHospitalar.getId(nomeUnidadeHospitalar as string)

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (id_unidade_hospitalar, cpf, nome, email, senha, telefone, genero, cargo, idade, is_adm) VALUE (?,?,?,?,?,?,?,?,?,?)`,
                 [idUnidadeHospitalar, cpf, nome, email, senhaCriptografada, telefone, genero, cargo, idade, is_adm] 
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
                especialidade, admin, nomeUnidadeHospitalar} = req.body as MedicoInput
                

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            //converte o nome da unidade medica para id
            const idUnidadeHospitalar = await UnidadeHospitalar.getId(nomeUnidadeHospitalar as string) 
            
            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (id_unidade_hospitalar, cpf, nome, email, senha, telefone, genero, idade, registro_medico, especialidade, is_admin) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
                [idUnidadeHospitalar, cpf,nome,email,senhaCriptografada,telefone,genero,idade, registroMedico, especialidade, admin]
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
                nome, cnpj, endereco, numeroEndereco, bairro, estado, cep
            } = req.body as UnidadeHospitalarInput

            const [resultado] = await db.execute (
                `INSERT INTO ${nomeTabela} (nome, cnpj, endereco, numero_endereco, bairro, estado, cep) VALUES (?,?,?,?,?,?,?)`,
                [nome, cnpj, endereco, numeroEndereco, bairro, estado, cep]
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

    static async cadastraNovosItensEstoque(req: Request, res: Response) {
        try {

            const codigo = await geraCodigoNumerico(tabela.estoque, 'codigo_item', 6)

            const {nomeItem, quantidade, fornecedor, idUnidadeHospitalar} = req.body as AdmEstoque
            
            const [resultado] = await db.execute(`
                INSERT INTO ${tabela.estoque} (nome, codigo_item, quantidade, fornecedor, id_unidade_hospitalar) VALUES (?,?,?,?,?)`,
                [nomeItem, codigo, quantidade, fornecedor, idUnidadeHospitalar]) 

            return res.status(200).json({
                mensagem: "Item cadastra com sucesso",
                codigoDoItem: codigo
            })
        }

        catch (error){
            console.error(error)
                return res.status(501).json({
                    mensagem: "Erro ao cadastrar o item",
                    error: error
            })
        }
    }


    static async reporEstoque(req: Request, res: Response){
        try {

            const {codigoItem} = req.params
            
            // verifica se o código existe
            
            const [row] = await db.execute<RowDataPacket[]>(`
                    SELECT codigo_item FROM ${tabela.estoque} WHERE codigo_item = ?`, 
                    [codigoItem])

            if(row.length === 0) {
                return res.status(404).json({
                    menssagem: "Codigo não encontrado!"
                })
            }

            // insere os novos items

            const {quantidade} = req.body as AdmEstoque

            const [resultado] = await db.execute<ResultSetHeader>(`
                UPDATE ${tabela.estoque} 
                SET quantidade = quantidade + ?  
                WHERE codigo_item = ?`, 
                [quantidade, codigoItem]
            ) 

            return res.status(200).json({
                mensagem: "Item reposto"
            })
        }

        catch (error){
            console.error(error)
                return res.status(501).json({
                    mensagem: "Erro ao cadastrar o item",
                    error: error
            })
        }
    }

    static async mostraEstoque (req: Request, res: Response) {
        try {

            const [rows] = await db.execute<RowDataPacket[]>(`
                SELECT * FROM ${tabela.estoque}`
            )

            if(rows.length === 0) {
                res.status(404).json({
                    mensagem: "Estoque não encontrado!"
                })
            }

            return res.status(200).json({
                estoque: rows
            }) 

        } 

        catch (error) {
            console.error(error)
            res.status(501).json({
                mensagem: "Erro ao mostra o estoque"
            })
        }
    }

    static async mostraRelatorioFinanceira (req: Request, res: Response) {

        async function  getHistoricoStatus (res: Response, status: string) {

            try {
                const [rows] = await db.execute<RowDataPacket[]>(`
                    SELECT * FROM ${tabela.movimentacaoFinanceira} WHERE = ?
                `, [status])
                
                if (rows.length === 0) {
                    return res.status(404).json({
                        mensagem: "nenhum resultado foi encontrado verifique o parametro da função"
                    })
                }

                return rows
            }

            catch {
                return res.status(500).json({
                    mensagem: "Erro ao buscar pelo status financeiro",
                    error: error
                })
            }
        } 

        async function getValorTotalStatus (res: Response, status: string){
            try {

                const [rows] = await db.execute<RowDataPacket[]>(`
                
                    SELECT SUM(valor) AS total FROM ${tabela.movimentacaoFinanceira} WHERE status = ?`,
                        [status])

                if (rows.length ===0 ){
                    return res.status(404).json({
                        mensagem: "status não encontrado, impossivel fazer a soma!"
                    })
                }
                
                return rows
            } 

            catch(error) {
                console.error(error)
                return res.status(500).json({
                    mensagem:  "Erro ao realizar a soma dos totais"
                })
            }
        }

        try {

            const relatorio = {
                pendente: {
                    itens: getHistoricoStatus(res, "pendente"),
                    total: getValorTotalStatus(res, "pendente")
                }, 

                cancelado: {
                    itens: getHistoricoStatus(res, "cancelado"),
                    total: getValorTotalStatus(res, "cancelado")
                },

                pago: {
                    itens: getHistoricoStatus(res, "pago"),
                    total: getValorTotalStatus(res, "pago")
                } 
            }

            return res.status(200).json({
                mensagem: "Relatorio gerado com sucesso!",
                data: relatorio
            })
        }

        catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao gerar o relatorio financeiro",
                erro: error
            })
        }
    }
}
