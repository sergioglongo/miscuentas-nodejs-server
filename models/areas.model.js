import Sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';

const AreaModel = db.define('areas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    color: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    icon: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    type:{
        type:Sequelize.ENUM(['in','out']),
        allowNull: false,
        defaultValue: 'out',
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

UsersModel.hasMany(AreaModel, { foreignKey: 'userId' });
AreaModel.belongsTo(UsersModel, { foreignKey: 'userId' });

export default AreaModel;