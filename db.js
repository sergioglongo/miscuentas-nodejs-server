import { Sequelize } from 'sequelize';
import config from './config/config.js'; // Asegúrate de que la ruta es correcta
import mysql from 'mysql2';
import pg from 'pg';
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  dialectModule: pg,
});


export default sequelize;
