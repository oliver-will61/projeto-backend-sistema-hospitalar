import {Request, Response, NextFunction} from 'express';

export const isPaciente = (req: Request, res: Response, next: NextFunction) => {
 
    const isPaciente = req.user?.acesso === "paciente" 
 
    if (!isPaciente) {
        res.status(403).json({
            messagem: "Acesso negado, requer acesso de paciente"
        });
        return 
    }

    next();
};

