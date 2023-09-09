import { DataTypes, Model } from "sequelize";
import {sequelize} from '../config';

export class Order extends Model {
    declare UserId: number;
    declare status: string;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    totalCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'confirmed', 'delivering', 'delivered', 'completed', 'cancelled']]
        }
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
});