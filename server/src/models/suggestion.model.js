module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define('Suggestion', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    suggestionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Suggestion;
};