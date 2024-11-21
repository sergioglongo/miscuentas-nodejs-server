import Sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';

const AccountEntity = db.define('account_entities', {
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
    deleted:{
        type:Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
   
});

UsersModel.hasMany(AccountEntity, { foreignKey: 'userId' });
AccountEntity.belongsTo(UsersModel, { foreignKey: 'userId' });

export default AccountEntity;