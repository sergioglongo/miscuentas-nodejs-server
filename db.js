import { Sequelize } from 'sequelize';
import mysql from 'mysql2';
import dotenv from 'dotenv';

import pg from 'pg';

const env = process.env.NODE_ENV || 'development';
if (env !== 'production') {
  dotenv.config();
}
// const dbConfig = config[env];

const options = {
  host: process.env.DB_HOST,
  logging: false,
  dialect: process.env.DB_TYPE,
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
console.log("Database connection options:", options);
console.log("Process environment:", process.env.NODE_ENV);


const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, options);

export default sequelize;