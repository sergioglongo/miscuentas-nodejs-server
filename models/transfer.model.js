import sequelize from 'sequelize';
import db from '../db.js';
import Unit from './unit.model.js';
import TransactionModel from './transaction.model.js';

const TransferModel = db.define('transfers', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

TransactionModel.hasMany(TransferModel, { foreignKey: 'transactionInId' });
TransferModel.belongsTo(TransactionModel, { foreignKey: 'transactionInId' });

TransactionModel.hasMany(TransferModel, { foreignKey: 'transactionOutId' });
TransferModel.belongsTo(TransactionModel, { foreignKey: 'transactionOutId' });

Unit.hasMany(TransferModel, { foreignKey: 'unitId' });
TransferModel.belongsTo(Unit, { foreignKey: 'unitId' });

export default TransferModel;