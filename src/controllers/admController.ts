import { Adm } from "../models/Adm";
import {Request, Response} from 'express';


export const login = async (req: Request, res: Response) => {
    Adm.login(req, res, 'administradores')
}

export const cadastroAdm =  async (req: Request, res: Response) => { 
    
    Adm.cadastroAdm(req, res, 'administradores');
};

export const cadastroMedico =  async (req: Request, res: Response) => { 

    Adm.cadastroMedico(req, res, 'profissional');
    
};

export const controllerCadastroUnidade = async (req: Request, res: Response) => {
    Adm.cadastroUnidade(req, res, 'unidade_hospitalar')
}

export const controllerCadastraNovosItensEstoque = async (req: Request, res: Response) => {
    Adm.cadastraNovosItensEstoque(req, res)
}

export const controllerReporEstoque = async (req: Request, res: Response) => {    
    Adm.reporEstoque(req, res)
}

export const controllerMostraEstoque = async (req: Request, res: Response) => {
    Adm.mostraEstoque(req, res)
}

export const controllerGeraRelatorioFinanceiro = async (req: Request, res: Response) => {
    Adm.geraRelatorioFinanceira(res)
}

export const controllerGeraRelatorioLeito = async (req: Request, res: Response) => {
    Adm.geraRelatorioLeitos(req, res)
}