'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SavedJob.init({
    userId: DataTypes.INTEGER,
    jobId: DataTypes.STRING,
    title: DataTypes.STRING,
    company: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.TEXT,
    skillsRequired: DataTypes.TEXT,
    applyUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SavedJob',
  });
  return SavedJob;
};