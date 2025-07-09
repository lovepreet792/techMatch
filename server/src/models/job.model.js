const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = sequelize.define('Job', {
  jobId: { type: DataTypes.STRING, unique: true },
  title: DataTypes.STRING,
  company: DataTypes.STRING,
  location: DataTypes.STRING,
  description: DataTypes.TEXT('long'),
  applyUrl: DataTypes.STRING,
  skillsRequired: DataTypes.TEXT,
});

module.exports = Job;