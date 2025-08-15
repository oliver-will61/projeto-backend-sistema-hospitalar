import {Request, Response, NextFunction} from 'express';

export const isMedico = (req: Request, res: Response, next: NextFunction) => {
 
    const isMedico = req.user?.acesso === "medico" 
 
    if (!isMedico) {
        res.status(403).json({
            messagem: "Acesso negado requer acesso de medico"
        });
        return 
    }

    next();
};

