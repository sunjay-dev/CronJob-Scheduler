import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";

declare global {
  namespace Express {
    interface Request {
      jwtUser?: any
    }
  }
}

export function restrictUserLogin(req: Request, res: Response, next: NextFunction): void {
  let token = req.cookies?.token;

  if (!token && typeof req.headers.authorization === "string") {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(401).json({
      message: "Please login again or create new account."
    });
    return;
  }

  try {
    const verifiedUser = verifyToken(token);
    if (!verifiedUser) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    req.jwtUser = verifiedUser;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Authentication failed" });
    return;
  }
}