var bcrypt = require("bcryptjs");

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
    email: {
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

    // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
    patient.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    };
    // Hooks are automatic methods that run during various phases of the patient Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    patient.addHook("beforeCreate", function(user) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

  return patient;
};
