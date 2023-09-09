import { DataTypes, Model } from "sequelize";
import {sequelize} from '../config';

export class Group extends Model {}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
});