import {Request, Response, NextFunction} from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.is_admin) {
        res.status(403).json({
            messagem: "Acesso negado. Requer privilégios de administrador"
        });
        return 
    }

    next();
};