import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const username: string = process.env.DATABASE_USERNAME || '';
const password: string = process.env.DATABASE_USER_PASSWORD || '';
const dbName: string = process.env.DATABASE_NAME || '';
const host: string = process.env.NODE_ENV === 'test' ? 'localhost' : 'mysql';

export const sequelize = new Sequelize(dbName, username, password, {
    host, //in the future: mysql
    port: process.env.NODE_ENV === 'test' ? 3307 : 3306,
    dialect: 'mysql',
    pool: {
        max: 100, // Số lượng kết nối tối đa
        min: 0,   // Số lượng kết nối tối thiểu
        acquire: 30000, // Thời gian tối đa (milliseconds) để lấy được kết nối
        idle: 10000    // Thời gian tối đa (milliseconds) một kết nối có thể ở trạng thái idle
    },
});
