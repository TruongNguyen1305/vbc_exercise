import { Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models";
import { getOne } from "../repositories/crud";
import { JwtPayload, LoginDto } from "../types";
import { AppError, generateAccessToken, generateRefreshToken } from "../utils";


async function login(dto: LoginDto, res: Response) {
    const user: User = await getOne(
        User, 
        {username: dto.username}, 
        ['id', 'username', 'password', 'isAdmin'],    
    );

    if(!user) {
        throw AppError.BadRequest(res, 'User not found');
    }

    if(!await user.isMatchpassword(dto.password)) {
        throw AppError.BadRequest(res, 'Invalid password');
    }

    return {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
    };
}

async function register(dto: LoginDto, res: Response) {
    const [user, created] = await User.findOrCreate({
        where: {username: dto.username},
        defaults: {
            password: dto.password,
        },
    });

    if(!created) {
        throw AppError.BadRequest(res, 'User already exists');
    }

    return {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
    };
}

const generateToken = (payload: JwtPayload) => {
    const accessToken: string = generateAccessToken(payload);
    const refreshToken: string = generateRefreshToken(payload);
    return {
        accessToken,
        refreshToken
    }
}

const reGenerateAccessToken = (refreshToken: string) => {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    const tokens = generateToken(decoded as JwtPayload);
    return {
        newAccessToken: tokens.accessToken,
        newRefreshToken: tokens.refreshToken
    };
}

export {login, register, generateToken, reGenerateAccessToken}