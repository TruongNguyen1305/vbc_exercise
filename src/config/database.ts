import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const username: string = process.env.DATABASE_USERNAME || '';
const password: string = process.env.DATABASE_USER_PASSWORD || '';
const dbName: string = process.env.DATABASE_NAME || '';
const host: string = process.env.DATABASE_HOST || 'localhost';

export const sequelize = new Sequelize(dbName, username, password, {
    host, //in the future: mysql
    // port: 3306,
    dialect: 'mysql',
});
