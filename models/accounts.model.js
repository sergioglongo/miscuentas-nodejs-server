import sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';
import AccountTypeModel from './accountTypes.model.js';
import AccountEntity from './accountEntities.model.js';

const AccountModel = db.define('accounts', {
    id:{
        type:sequelize.STRING,
        primaryKey: true,
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

    deleted: {
        type: sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    default: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

UsersModel.hasMany(AccountModel, { foreignKey: 'userId' });
AccountModel.belongsTo(UsersModel, { foreignKey: 'userId' });

AccountTypeModel.hasMany(AccountModel, { foreignKey: 'typeId' });
AccountModel.belongsTo(AccountTypeModel, { foreignKey: 'typeId' });

AccountEntity.hasMany(AccountModel, { foreignKey: 'entityId' });
AccountModel.belongsTo(AccountEntity, { foreignKey: 'entityId' });

export default AccountModel;