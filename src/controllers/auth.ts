import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils";
import * as authService from "../services/auth";

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await authService.login(req.body, res);
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
        next(error);
    }
}

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await authService.register(req.body, res);

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
        next(error);
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