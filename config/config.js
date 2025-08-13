import dotenv from 'dotenv';
// process.loadEnvFile();
if (process.env.NODE_ENV == 'production') {
  dotenv.config();
}
// Realizar el cambio de formar un objeto que obtenga las variables de entorno y despues pasarle al export default es mas eficiente
// asi la lectura del env es una sola vez y ya queda guardado en la variable
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
