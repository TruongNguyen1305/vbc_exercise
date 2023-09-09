import { DataTypes, Model } from "sequelize";
import {sequelize} from '../config';

export class OrderDetail extends Model {}

OrderDetail.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    sequelize,
});