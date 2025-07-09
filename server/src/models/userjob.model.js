const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Job = require('./job.model');

const UserJob = sequelize.define('UserJob', {
  status: DataTypes.STRING, // 'saved' or 'applied'
});

User.belongsToMany(Job, { through: UserJob, as: 'jobs' });
Job.belongsToMany(User, { through: UserJob, as: 'users' });

UserJob.belongsTo(Job);
UserJob.belongsTo(User);

module.exports = UserJob;
