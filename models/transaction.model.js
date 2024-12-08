import sequelize from 'sequelize';
import db from '../db.js';
import AccountModel from './account.model.js';
import CategoryModel from './category.model.js';
import UnitModel from './unit.model.js';
import PayMethodModel from './payMethod.model.js';

const TransactionModel = db.define('transactions', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    description: {
        type: sequelize.TEXT,
        allowNull: false,
    },
    amount: {
        type: sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.00
    },
    discount: {
        type: sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.00
    },
    type: {
        type: sequelize.ENUM(['in', 'out']),
        allowNull: false,
        defaultValue: 'out',
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

CategoryModel.hasMany(TransactionModel, { foreignKey: 'categoryId' });
TransactionModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

UnitModel.hasMany(TransactionModel, { foreignKey: 'unitId' });
TransactionModel.belongsTo(UnitModel, { foreignKey: 'unitId' });

PayMethodModel.hasMany(TransactionModel, { foreignKey: 'payMethodId' });
TransactionModel.belongsTo(PayMethodModel, { foreignKey: 'payMethodId' });


export default TransactionModel;