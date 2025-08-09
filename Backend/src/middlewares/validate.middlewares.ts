import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const isDefaultError = error.issues[0].message.startsWith("Invalid input");
        const message = isDefaultError? `${error.issues[0].path}: ${error.issues[0].message}`: error.issues[0].message;
        res.status(400).json({ message });
        return;
      }

      res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
  };
}

export function validateParams(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed as unknown as typeof req.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const isDefaultError = error.issues[0].message.startsWith("Invalid input");
        const message = isDefaultError? `${error.issues[0].path}: ${error.issues[0].message}`: error.issues[0].message;
        
        res.status(400).json({ message });
        return;
      }

      res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
  };
}