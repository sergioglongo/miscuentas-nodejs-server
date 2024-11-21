import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    type: process.env.DB_TYPE,
    dialect: process.env.DB_TYPE,
    migrationStorageTableName: 'SequelizeMeta',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    type: process.env.DB_TYPE,
    dialect: process.env.DB_TYPE,
    migrationStorageTableName: 'SequelizeMeta',
    logging: false
  },
  email: {
		user: process.env.USER_EMAIL,
		pass: process.env.PASS_EMAIL,
	},
  token:{
    token_key: process.env.TOKEN_KEY,
    user_token_key: process.env.USER_TOKEN_KEY,
    admin_token_key: process.env.ADMIN_TOKEN_KEY,
  }
};
