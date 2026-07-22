import bcrypt from "bcrypt";
import env from "../config/env.config.js";

export const hashPassword = async (password: string, saltRounds = env.BCRYPT_SALT_ROUNDS): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
