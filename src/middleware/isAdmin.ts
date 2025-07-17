import {Request, Response, NextFunction} from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.is_admin) {
        return res.status(403).json({
            messagem: "Acesso negado. Requer privilégios de administrador"
        });
    }

    next();
};