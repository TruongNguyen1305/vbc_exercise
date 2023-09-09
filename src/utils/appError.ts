import { Response } from "express";

export class AppError extends Error {

    constructor(message: string, name: string) {
        super(message);
        this.name = name;
        Error.captureStackTrace(this, this.constructor);
    }

    public static InternalServerError(res: Response, message: string): AppError {
        res.status(500);
        return new AppError(message, "InternalServerError");
    }

    public static NotFound(res: Response, message: string): AppError {
        res.status(404);
        return new AppError(message, "NotFound");
    }

    public static Forbidden(res: Response, message: string): AppError {
        res.status(403);
        return new AppError(message, "Forbidden");
    }

    public static Unauthorized(res: Response, message: string): AppError {
        res.status(401);
        return new AppError(message, "Unauthorized");
    }

    public static BadRequest(res: Response, message: string): AppError {
        res.status(400);
        return new AppError(message, "BadRequest");
    }
}