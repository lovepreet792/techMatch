const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DB || 'techmatch',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || 'Love@2003',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
  }
);

module.exports = sequelize;
