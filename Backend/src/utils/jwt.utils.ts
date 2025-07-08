import 'dotenv/config'
import jwt from 'jsonwebtoken';

export const signToken = (payload:object):string => {
    return jwt.sign(payload, process.env.JWT_SECRET!)
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!)
}