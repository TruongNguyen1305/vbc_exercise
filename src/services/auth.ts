import { Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models";
import { getOne } from "../repositories/crud";
import { JwtPayload, LoginDto } from "../types";
import { generateAccessToken, generateRefreshToken } from "../utils";


async function login(dto: LoginDto) {
    const user: User = await getOne(
        User, 
        {username: dto.username}, 
        ['id', 'username', 'password', 'isAdmin'],    
    );

    if(!user) 
        throw new Error('User not found');

    if(!await user.isMatchpassword(dto.password)) 
        throw new Error('Invalid password');

    return {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
    };
}

async function register(dto: LoginDto) {
    const [user, created] = await User.findOrCreate({
        where: {username: dto.username},
        defaults: {
            password: dto.password,
        },
    });

    if(!created) 
        throw new Error('User already exists');

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