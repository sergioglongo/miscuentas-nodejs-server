import sequelize from 'sequelize';
import db from '../db.js';

const UserModel = db.define('users',
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        firstname: {
            type: sequelize.STRING,
            allowNull: true,
        },
        lastname: {
            type: sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: sequelize.STRING,
            allowNull: false,
            encrypt: true
        },
        photo: {
            type: sequelize.STRING,
            allowNull: true,
        },
        restore_code: {
            type: sequelize.STRING,
            allowNull: true,
        },
        google_id: {
            type: sequelize.STRING,
            allowNull: true,
        },
        google_access_token: {
            type: sequelize.STRING,
            allowNull: true,
        },
        google_refresh_token: {
            type: sequelize.STRING,
            allowNull: true,
        },
        google_token_expires: {
            type: sequelize.DATE,
            allowNull: true,
        },
        register_date: {
            type: sequelize.DATE,
            allowNull: true,
        },
        last_login_date: {
            type: sequelize.DATE,
            allowNull: true,
        },
        type: {
            type: sequelize.ENUM(['user', 'guest']),
            allowNull: false,
            defaultValue: 'user',
        },
        permissions: {
            type: sequelize.JSON,
            allowNull: true,
            defaultValue: JSON.stringify({})
        },
        is_premium: {
            type: sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_active: {
            type: sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        deleted: {
            type: sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }
);

export default UserModel;