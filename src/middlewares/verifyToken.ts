import { Response, NextFunction } from "express"
import jwt from 'jsonwebtoken';
import { AppError } from "../utils";
import { getById } from "../repositories/crud";
import { User } from "../models";
import { JwtPayload, RequestWithAuthInfo } from "../types";

export const verifyToken = async (req: RequestWithAuthInfo, res: Response, next: NextFunction) => {
    const authInfo: string | undefined = req.header('Authorization');
    if(authInfo && authInfo.startsWith('Bearer ')) {
        const token: string = authInfo.slice(7);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, async (err, decoded) => {
            if(err) {
                return next(AppError.Forbidden(res, err.message));
            }
            const user = await getById(User, (decoded as JwtPayload).id, ['id', 'username', 'isAdmin']);
            req.user = {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin
            }
            next();
        });
    }
    else {
        next(AppError.Unauthorized(res, 'Unauthorized'));
    }
}