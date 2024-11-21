import sequelize from 'sequelize';
import db from '../db.js';

const UsersModel = db.define('users', {
    id:{
        type:sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    username:{
        type:sequelize.STRING,
        allowNull: false,
    },
    email:{
        type:sequelize.STRING,
        allowNull: false,
    },
    password:{
        type:sequelize.STRING,
        allowNull: false,
        encrypt: true
    },
    photo:{
        type:sequelize.STRING,
        allowNull: true,
    },
    restore_code:{
        type:sequelize.STRING,
        allowNull: true,
    },
    google_id:{
        type:sequelize.STRING,
        allowNull: true,
    },
    google_access_token:{
        type:sequelize.STRING,
        allowNull: true,
    },
    google_refresh_token:{
        type:sequelize.STRING,
        allowNull: true,
    },
    google_token_expires:{
        type:sequelize.DATE,
        allowNull: true,
    },
    register_date:{
        type:sequelize.DATE,
        allowNull: true,
    },
    last_login_date:{
        type:sequelize.DATE,
        allowNull: true,
    },
    type:{
        type:sequelize.STRING,
        allowNull: true,
    },
    permissions: {
        type: sequelize.JSON,
        allowNull: true,
    },
    is_active: {
        type: sequelize.BOOLEAN,
        allowNull: true,
    },
    is_premium: {
        type: sequelize.BOOLEAN,
        allowNull: true,
    },
});

export default UsersModel;