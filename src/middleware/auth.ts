import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                is_admin: boolean;
            };
        }
    }
}

export const verificaToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            messagem: 'Token não fornecido'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE!) as {
            id: string,
            is_admin: boolean;
        };

        req.user = decoded //add os dados do usuário à requisição
        next();
    } catch(error){
        console.error(error)
        return res.status(401).json({
            message: "Token inválido"
        })
    }
};