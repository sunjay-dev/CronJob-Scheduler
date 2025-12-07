import jwt, { SignOptions } from "jsonwebtoken";

export const signToken = (payload: object, expiresIn?: SignOptions["expiresIn"]): string => {
  if (expiresIn) return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });

  return jwt.sign(payload, process.env.JWT_SECRET!);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
