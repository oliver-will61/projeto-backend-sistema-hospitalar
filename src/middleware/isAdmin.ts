import {Request, Response, NextFunction} from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    
    const isAdmin = req.user?.is_adm === true  || req.user?.is_adm === 1;
    console.log(isAdmin)
    if (!isAdmin) {
        res.status(403).json({
            messagem: "Acesso negado. Requer privilégios de administrador"
        });
        return 
    }

    next();
};