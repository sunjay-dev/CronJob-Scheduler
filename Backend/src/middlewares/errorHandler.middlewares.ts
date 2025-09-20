import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    
    if (err instanceof AppError) {
        logger.error({ 
            statusCode: err.statusCode, 
            details: err.details || {}, 
            method: req.method,
            url: req.originalUrl
        }, err.message);

        res.status(err.statusCode).json({
            message: err.message,
            ...(err.details || {})
        });
        return;
    }

    logger.error({ stack: err.stack || {}, method: req.method, url: req.originalUrl }, err.message);

    res.status(500).json({
        message: "Something went wrong, Please try again later."
    });
    return;
};
