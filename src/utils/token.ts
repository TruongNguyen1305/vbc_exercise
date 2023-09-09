import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const generateAccessToken = (payload: JwtPayload) : string => {
    return jwt.sign(
        {
            id: payload.id, 
            username: payload.username
        }, 
        process.env.ACCESS_TOKEN_SECRET as string, 
        {
            expiresIn: '30m'
        }
    );
}

export const generateRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(
        {
            id: payload.id, 
            username: payload.username
        }, 
        process.env.REFRESH_TOKEN_SECRET as string, 
        {
            expiresIn: '2h'
        }
    );
}