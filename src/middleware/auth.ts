import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                is_adm: boolean | number;
                acesso: string
            };
        }
    }
}

export const verificaToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    //caso o token não exista
    if (!token) {
        res.status(401).json({messagem: "Token não fornecido"})
        return 
    }

    //descriptografa o token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string,
            email: string,
            usuario: string,
            is_adm: number,
            acesso: string
        };

        //add os dados descriptografados do usuário à requisição
        req.user = decoded 
        next();
    } catch(error){
        console.error(error)
        res.status(401).json({
            messagem: "Token inválido"
        })
    }
};


const verificaAcesso = (acessoRequerido: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const acessoLiberado = req.user?.acesso === acessoRequerido

        if(!acessoLiberado) {
            res.status(403).json({
                message: `Acesso negado, requer acesso de ${acessoRequerido}`
            });

            return
        }

        next();
    } ;
};


export const isMedico = verificaAcesso('medico')
export const isPaciente = verificaAcesso('paciente')