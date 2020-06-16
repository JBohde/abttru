module.exports = function (sequelize, DataTypes) {
  const Statistics = sequelize.define('Statistics', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      field: 'patient_id',
      type: DataTypes.UUID,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    riskFactor: {
      field: 'risk_factor',
      type: DataTypes.STRING,
    },
    dietRecommendation: {
      field: 'diet_recommendation',
      type: DataTypes.STRING,
    },
    dietRestriction: {
      field: 'diet_restriction',
      type: DataTypes.STRING,
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
    },
  });

  Statistics.associate = models => {
    Statistics.belongsTo(models.Patient, {
      as: 'patient',
      foreignKey: 'patientId',
      targetKey: 'id',
    });
  };

  return Statistics;
};
