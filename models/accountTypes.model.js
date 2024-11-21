import Sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';

const AccountTypeModel = db.define('account_types', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    type:{
        type:Sequelize.ENUM(['bank','electronic','cash','debt','other']),
        allowNull: false,
        defaultValue: 'bank',
    },
    deleted:{
        type:Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
   
});

UsersModel.hasMany(AccountTypeModel, { foreignKey: 'userId' });
AccountTypeModel.belongsTo(UsersModel, { foreignKey: 'userId' });

export default AccountTypeModel;