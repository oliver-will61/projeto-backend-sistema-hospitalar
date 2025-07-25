import {Request, Response, NextFunction} from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
 
    console.log(req.user);

    const isAdmin = req.user?.is_adm === true  || req.user?.is_adm === 1;
 
    if (!isAdmin) {
        res.status(403).json({
            messagem: "Acesso negado. Requer privilégios de administrador"
        });
        return 
    }

    next();
};