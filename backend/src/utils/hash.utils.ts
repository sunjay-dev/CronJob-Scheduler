import bcrypt from "bcrypt";

export const hashPassword = async (password: string, saltRounds = 8): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePasswords = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
