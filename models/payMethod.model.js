import sequelize from 'sequelize';
import db from '../db.js';
import AccountModel from './account.model.js';

const PayMethodModel = db.define('pay_methods', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    method: {
        type: sequelize.ENUM(['debit', 'credit', 'cash', 'transfer', 'other']),
        allowNull: false,
        defaultValue: 'debit',
    },
    type : {
        type: sequelize.ENUM(['in','out']),
        allowNull: false,
        defaultValue: 'out',
    },
    excluded: {
        type: sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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

AccountModel.hasMany(PayMethodModel, { foreignKey: 'accountId' });
PayMethodModel.belongsTo(AccountModel, { foreignKey: 'accountId' });

export default PayMethodModel;