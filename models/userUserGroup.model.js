import db from '../db.js';
import UsersModel from './users.model.js';
import UserGroupModel from './usersGroup.model.js';

const UserUserGroupModel = db.define('user_user_groups', {});

UsersModel.belongsToMany(UserGroupModel, { through: 'user_user_groups' });
UserGroupModel.belongsToMany(UsersModel, { through: 'user_user_groups' });

export default UserUserGroupModel;