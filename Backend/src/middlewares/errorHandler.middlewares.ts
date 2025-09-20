import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
            ...(err.details || {})
        });
        console.error(`${err.statusCode} - ${err.message}`);
        return;
    }

    res.status(500).json({
        message: "Something went wrong"
    });
    return;
};
