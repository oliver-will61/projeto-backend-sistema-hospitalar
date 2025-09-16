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