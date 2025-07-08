import { Request, Response,NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function restrictUserLogin(req: Request, res: Response, next: NextFunction):void {
    const token = req.cookies?.token;
    
    if(!token){
        res.status(400).json({
            message: "Please Login"
        });
        return;
    }

    try {
    const verifiedUser = verifyToken(token);
    if (!verifiedUser) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.user = verifiedUser; 
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Authentication failed" });
    return;
  }
}