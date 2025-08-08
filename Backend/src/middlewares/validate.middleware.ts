import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validate(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: error.issues[0].message,
                });
                return;
            }

            res.status(500).json({ message: "Something went wrong. Please try again later." });
        }
    };
}