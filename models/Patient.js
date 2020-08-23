const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      field: 'first_name',
      type: DataTypes.STRING,
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorId: {
      field: 'doctor_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'doctors',
        key: 'id',
      },
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

  Patient.beforeCreate(patient => {
    const dbPatient = patient;
    dbPatient.id = uuidv4();
    return dbPatient;
  });

  // Hooks are automatic methods that run during various phases of the Patient Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Patient.beforeCreate(user => {
    // eslint-disable-next-line no-param-reassign
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  // Creating a custom method for our User model.
  // This will check if an unhashed password entered by the user
  // can be compared to the hashed password stored in our database
  Patient.prototype.validatePassword = (password, userPassword) => bcrypt
    .compare(password, userPassword);

  Patient.associate = models => {
    Patient.belongsTo(models.Doctor, {
      foreignKey: 'doctorId',
      targetKey: 'id',
      as: 'doctor',
    });
    Patient.hasOne(models.Statistics, {
      as: 'statistics',
      foreignKey: 'patientId',
    });
    Patient.hasMany(models.Recipes, { as: 'recipes', foreignKey: 'patientId' });
  };

  return Patient;
};
