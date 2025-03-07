import { Sequelize } from 'sequelize';
import config from './config/config.js'; // Asegúrate de que la ruta es correcta
import mysql from 'mysql2';
import pg from 'pg';
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const options = {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  dialectModule: pg,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Add SSL configuration for production environment
if (env === 'production') {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
  // Add additional production configurations if needed
  options.logging = false;
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, options);

export default sequelize;