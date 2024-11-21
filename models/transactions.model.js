import sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';
import AccountModel from './accounts.model.js';
import CategoryModel from './categories.model.js';

const TransactionModel = db.define('transactions', {
    id:{
        type:sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    description:{
        type:sequelize.TEXT,
        allowNull: false,
    },
    amount:{
       type: sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.00
    },
    discount:{
       type: sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.00
    },
    date: {
        type: sequelize.DATE,
        allowNull: false,
    },
    deleted: {
        type: sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
});

AccountModel.hasMany(TransactionModel, { foreignKey: 'accountId' });
TransactionModel.belongsTo(AccountModel, { foreignKey: 'accountId' });

CategoryModel.hasMany(TransactionModel, { foreignKey: 'categoryId' });
TransactionModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

UsersModel.hasMany(TransactionModel, { foreignKey: 'userId' });
TransactionModel.belongsTo(UsersModel, { foreignKey: 'userId' });

export default TransactionModel;