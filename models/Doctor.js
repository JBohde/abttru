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

    // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
    doctor.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    };
    // Hooks are automatic methods that run during various phases of the patient Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    doctor.addHook("beforeCreate", function(user) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

  return doctor;
};
