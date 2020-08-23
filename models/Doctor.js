const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
    },
  });

  Doctor.beforeCreate(doctor => {
    const dbDoctor = doctor;
    dbDoctor.id = uuidv4();
    return dbDoctor;
  });

  // Hooks are automatic methods that run during various phases of the patient Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Doctor.beforeCreate(user => {
    // eslint-disable-next-line no-param-reassign
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  // Creating a custom method for our User model.
  // This will check if an unhashed password entered by the user
  //  can be compared to the hashed password stored in our database
  Doctor.prototype.validatePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      return cb(null, isMatch);
    });
  };

  Doctor.associate = models => {
    Doctor.hasMany(models.Patient, { as: 'patients', foreignKey: 'doctorId' });
  };

  return Doctor;
};
