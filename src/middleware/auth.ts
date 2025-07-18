import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                is_adm: boolean | number;
            };
        }
    }
}

export const verificaToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        res.status(401).json({messagem: "Token não fornecido"})
        return 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string,
            is_adm: boolean;
        };

        req.user = decoded //add os dados do usuário à requisição
        next();
    } catch(error){
        console.error(error)
        res.status(401).json({
            messagem: "Token inválido"
        })
    }
};