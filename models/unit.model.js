import sequelize from 'sequelize';
import db from '../db.js';

const UnitModel = db.define('unit', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize.TEXT,
        allowNull: true,
    },
    photo: {
        type: sequelize.STRING,
        allowNull: true,
    },
    is_premium: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    last_change_date: {
        type: sequelize.DATE,
        allowNull: true,
    },
    is_active: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    deleted: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

export default UnitModel;