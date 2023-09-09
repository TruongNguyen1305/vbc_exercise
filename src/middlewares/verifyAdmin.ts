import { Response, NextFunction } from "express";
import { RequestWithAuthInfo } from "../types";
import { AppError } from "../utils";

export const verifyAdmin = async (req: RequestWithAuthInfo, res: Response, next: NextFunction) => {
    if(req.user && req.user.isAdmin) return next();
    next(AppError.Forbidden(res, 'You are not allowed to access this API'));
}