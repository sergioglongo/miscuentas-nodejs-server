import sequelize from 'sequelize';
import db from '../db.js';
import AreaModel from './areas.model.js';

const CategoryModel = db.define('categories', {
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
    color: {
        type: sequelize.STRING,
        allowNull: true,
    },
    icon: {
        type: sequelize.STRING,
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
    default: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

AreaModel.hasMany(CategoryModel, { foreignKey: 'areaId' });
CategoryModel.belongsTo(AreaModel, { foreignKey: 'areaId' });


export default CategoryModel;