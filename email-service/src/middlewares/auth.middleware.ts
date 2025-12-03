import type { Request, Response, NextFunction } from 'express';

export function RestrictAuthenticatedRequest(req: Request, res: Response, next: NextFunction) {

    const { authorization } = req.headers;

    if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    
    const token = authorization.split(' ')[1];
    
    if(!token || token !== process.env.EMAIL_SERVICE_SECRET){
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    next();
}