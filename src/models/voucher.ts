import { DataTypes, Model } from "sequelize";
import {sequelize} from '../config';
import { ValidationOptions } from "sequelize/types/instance-validator";

export class Voucher extends Model {
    declare id: number;
    declare startDate: Date;
    declare endDate: Date;
    declare type: string;
    declare value: number;
    declare maxValue: number;
    declare applyFor: string;
    declare quantity: number;
}

Voucher.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applyFor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'all',
        validate: {
            isIn: [['all', 'users', 'groups', 'products', 'categories']]
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'created',
        validate: {
            isIn: [['created', 'in-term', 'expired']]
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Voucher is out of stock'
            }
        }
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lowerBoundDeal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['percentage', 'value']]
        }
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maxValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
});

Voucher.addHook('beforeValidate', (instance: Voucher, options: ValidationOptions) => {
    if(instance.startDate !== instance.previous('startDate') && instance.startDate <= new Date()) throw new Error('Start date must be after current date');
    if(instance.endDate !== instance.previous('endDate') && instance.endDate <= instance.startDate) throw new Error('End date must be after start date');

    if(instance.type === 'percentage') {
        if(instance.value <= 0 || instance.value > 100)
            throw new Error('Voucher value for percentage type must be between 1 and 100');
        if(!instance.maxValue)
            throw new Error('maxValue is required');
    }
    else if(instance.type === 'value') {
        if(instance.value <= 0)
            throw new Error('Invalid voucher value');
        instance.maxValue = instance.value;
    }
});