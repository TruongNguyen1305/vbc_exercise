import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user";
import { AppError } from "../utils";

async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users =  await userService.getAllUser();
        res.status(200).json(users);
    } catch (error) {
        next(AppError.InternalServerError(res, 'Error while getting users'));
    }
}

export {getAllUsers}