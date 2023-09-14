import { Redis } from "ioredis";
import dotenv from 'dotenv';

dotenv.config()

export const redis = new Redis({
    port: process.env.NODE_ENV === 'test' ? 6380 : 6379,
    host: 'localhost',
    //username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_USER_PASSWORD
});