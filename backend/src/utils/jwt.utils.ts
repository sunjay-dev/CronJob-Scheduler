import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env.config.js";

export const signToken = (payload: object, options?: SignOptions): string => {
  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};
