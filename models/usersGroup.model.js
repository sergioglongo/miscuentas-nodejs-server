import sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';

const UserGroupModel = db.define('user_groups', {
    id:{
        type:sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name:{
        type:sequelize.STRING,
        allowNull: false,
    },
    type:{
        type:sequelize.STRING,
        allowNull: true,
    },
    deleted: {
        type: sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
});

export default UserGroupModel;