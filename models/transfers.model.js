import sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';
import AccountModel from './accounts.model.js';

const TransferModel = db.define('transfers', {
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

AccountModel.hasMany(TransferModel, { foreignKey: 'accountInId' });
TransferModel.belongsTo(AccountModel, { foreignKey: 'accountInId' });

AccountModel.hasMany(TransferModel, { foreignKey: 'accountOutId' });
TransferModel.belongsTo(AccountModel, { foreignKey: 'accountOutId' });

UsersModel.hasMany(TransferModel, { foreignKey: 'userId' });
TransferModel.belongsTo(UsersModel, { foreignKey: 'userId' });

export default TransferModel;