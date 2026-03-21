import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils.js";
import logger from "../utils/logger.utils.js";
import { JwtUser } from "../types/jwt.types.js";

export function extractToken(req: Request): string | undefined {
  let accessToken = req.cookies?.accessToken;

  if (!accessToken && typeof req.headers.authorization === "string") {
    const authHeader = req.headers.authorization;

    if (authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    }
  }

  return accessToken;
}

export function restrictUserLogin(req: Request, res: Response, next: NextFunction): void {
  const accessToken = extractToken(req);

  if (!accessToken) {
    res.status(401).json({
      authorized: false,
      message: "Please login again or create new account.",
    });
    return;
  }

  try {
    const verifiedUser = verifyToken(accessToken) as JwtUser;
    if (!verifiedUser) {
      res.status(401).json({ authorized: false, message: "Invalid or expired token" });
      return;
    }

    req.jwtUser = verifiedUser;
    next();
  } catch (err) {
    logger.error({ message: "Auth error:", err });
    res.status(401).json({ authorized: false, message: "Authentication failed" });
    return;
  }
}

// export function softRestrictUserLogin(req: Request, res: Response, next: NextFunction): void {
//   const accessToken = extractToken(req);

//   if (!accessToken) {
//     res.status(401).json({
//       authorized: false,
//       message: "Please login again or create a new account.",
//     });
//     return;
//   }

//   try {
//     const verifiedUser = verifyToken(accessToken) as JwtUser;
//     if (!verifiedUser) {
//       res.status(200).json({
//         authorized: false,
//         message: "Invalid or expired token",
//       });
//       return;
//     }

//     req.jwtUser = verifiedUser;
//     next();
//   } catch (err) {
//     logger.error({ message: "Auth error:", err });
//     res.status(200).json({
//       authorized: false,
//       message: "Authentication failed",
//     });
//     return;
//   }
// }

export function prometheusAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;
  }

  if (token !== (process.env.PROMETHEUS_SECRET as string)) {
    res.status(403).json({ message: "Unauthorized access to metrics" });
    return;
  }

  next();
}
