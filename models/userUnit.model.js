import db from '../db.js';
import sequelize from 'sequelize';
import UserModel from './user.model.js';
import Unit from './unit.model.js';


const UserUnitModel = db.define('user_unit', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    type: {
        type: sequelize.ENUM(['owner', 'user', 'guest']),
        allowNull: false,
        defaultValue: 'owner',
    },
    permissions: {
        type: sequelize.JSON,
        allowNull: true,
        defaultValue: JSON.stringify({})
    },
    is_main_unit: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_active: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
});

UserModel.belongsToMany(Unit, { through: 'user_unit' });
Unit.belongsToMany(UserModel, { through: 'user_unit' });

export default UserUnitModel;