import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers);
    next(AppError.NotFound(res, `Not Found - ${req.originalUrl}`))
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode >= 500 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};