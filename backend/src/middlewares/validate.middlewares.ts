import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function createValidater(source: "body" | "params" | "query", schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      Object.assign(req[source], parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.issues[0].message, field: error.issues[0].path[0] });
        return;
      }

      res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
  };
}

export const validateBody = (schema: z.ZodType) => createValidater("body", schema);
export const validateParams = (schema: z.ZodType) => createValidater("params", schema);
export const validateQuery = (schema: z.ZodType) => createValidater("query", schema);
