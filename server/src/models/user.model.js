const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  techStack: DataTypes.TEXT,
  resumePath: {
  type: DataTypes.STRING,
  allowNull: true,
},
});

module.exports = User;
