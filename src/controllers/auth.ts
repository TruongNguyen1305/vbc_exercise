import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";
import * as authService from "../services/auth";

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await authService.login(req.body);
        const {accessToken, refreshToken} = authService.generateToken({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        });

        res.status(200).json({
            user,
            accessToken
        });
    } catch (error) {
        const errors = ['User not found', 'Invalid password', ]
        if(error instanceof Error){
            if(errors.includes(error.message))
                next(AppError.BadRequest(res, error.message));
            else
                next(AppError.InternalServerError(res, error.message))
        }
    }
}

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await authService.register(req.body);

        const {accessToken, refreshToken} = authService.generateToken({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        });

        res.status(201).json({
            user,
            accessToken
        });
    } catch (error) {
        if(error instanceof Error) {
            if(error.message === 'User already exists')
                next(AppError.BadRequest(res, error.message));
            else
                next(AppError.InternalServerError(res, error.message))
        }
    }
}

async function reGenerateAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies['refreshToken'];
        if(!refreshToken) 
            return next(AppError.Forbidden(res, 'Refresh token expired'));

        const {newAccessToken, newRefreshToken} = authService.reGenerateAccessToken(refreshToken);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'strict',
        });

        res.status(200).json(newAccessToken);
    } catch (error) {
        next(error)
    }
}

export {login, register, reGenerateAccessToken}