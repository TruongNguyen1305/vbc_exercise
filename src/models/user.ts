import { CreateOptions, DataTypes, Model, UpdateOptions } from "sequelize";
import {sequelize} from '../config';
import bcrypt from 'bcryptjs';

export class User extends Model {
    declare id: number;
    declare username: string;
    declare password: string;
    declare isAdmin: boolean;

    async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async isMatchpassword(enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: {
                args: [3, 20],
                msg: 'Username length must be greater than 3 and less than 20'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type :DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
});

User.beforeCreate(async (user: User, options: CreateOptions<any>) => {
    const password = user.getDataValue('password');
    user.setDataValue('password', await user.hashPassword(password));
});

User.beforeUpdate(async (user: User, options: UpdateOptions<any>) => {
    if(user.changed("password")) {
        const newPassword = user.getDataValue('password');
        user.setDataValue('password', await user.hashPassword(newPassword));
    }
});
