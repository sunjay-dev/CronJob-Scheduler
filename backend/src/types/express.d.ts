import { JwtUser } from "./jwt.types.js";

declare global {
  namespace Express {
    interface Request {
      jwtUser: JwtUser;
    }
  }
}

export {};
