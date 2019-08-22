module.exports = function(sequelize, DataTypes) {
  var patient = sequelize.define('patient', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_name: {
      type: DataTypes.STRING,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  });

  return patient;
};
