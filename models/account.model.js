import sequelize from 'sequelize';
import db from '../db.js';
import UnitModel from './unit.model.js';

const AccountModel = db.define('accounts', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name:{
        type:sequelize.STRING,
        allowNull: false,
    },
    balance:{
       type: sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.00
    },
    currency: {
        type: sequelize.ENUM(['Pesos','Dolar','Euro']),
        allowNull: false,
        defaultValue: 'Pesos',
    },
    type:{
        type:sequelize.ENUM(['bank','electronic','cash','debt','other']),
        allowNull: false,
        defaultValue: 'bank',
    },
    is_active: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    default: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    deleted: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

UnitModel.hasMany(AccountModel, { foreignKey: 'unitId' });
AccountModel.belongsTo(UnitModel, { foreignKey: 'unitId' });

export default AccountModel;