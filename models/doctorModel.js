module.exports = function(sequelize, DataTypes) {
  var doctor = sequelize.define('doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.STRING,
    },
    doctor_name: {
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

  return doctor;
};
