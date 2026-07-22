import { type Request, type Response, type NextFunction } from "express";
import logger from "../utils/logger.utils.js";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      message: `${req.method} ${req.originalUrl || req.url} - ${res.statusCode} in ${duration}ms`,
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: duration,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });
  });

  next();
};
