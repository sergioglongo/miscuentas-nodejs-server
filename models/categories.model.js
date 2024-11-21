import Sequelize from 'sequelize';
import db from '../db.js';
import UsersModel from './users.model.js';
import AreaModel from './areas.model.js';

const CategoryModel = db.define('categories', {
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

UsersModel.hasMany(CategoryModel, { foreignKey: 'userId' });
CategoryModel.belongsTo(UsersModel, { foreignKey: 'userId' });

AreaModel.hasMany(CategoryModel, { foreignKey: 'areaId' });
CategoryModel.belongsTo(AreaModel, { foreignKey: 'areaId' });


export default CategoryModel;