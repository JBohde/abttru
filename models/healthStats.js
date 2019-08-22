module.exports = function(sequelize, DataTypes) {
  var healthStats = sequelize.define('healthStats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.STRING,
    },
    risk_factor: {
      type: DataTypes.STRING,
    },
    diet_recommendation: {
      type: DataTypes.STRING,
    },
    diet_restriction: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });

  return healthStats;
};
