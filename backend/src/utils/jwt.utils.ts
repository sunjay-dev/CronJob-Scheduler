import jwt, { SignOptions } from "jsonwebtoken";

export const signToken = (payload: object, options?: SignOptions): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
