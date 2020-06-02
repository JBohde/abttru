const db = require('../models');
const passport = require("../config/passport");

module.exports = {
    // ******* DOCTOR ROUTES ******* //
    doctorLogin: (req, res) => {
      var doctorName = req.body.doctor_name;
      var password = req.body.password;

      db.doctor
        .findAll({
          where: {
            doctor_name: doctorName,
            password: password,
          },
        })
        .then(response => {
          var doctorObj = response;
          if (doctorObj.length == 0) {
            res.redirect('/');
          } else {
            req.session.doctor_name = doctorName;
            res.redirect('/doctor/form');
          }
        });
    },

    doctorDashboard: (req, res) => {
      db.patient.belongsTo(db.healthStats, {
        foreignKey: 'id',
        constraints: false,
      });
      db.patient.belongsTo(db.savedRecipes, {
        foreignKey: 'id',
        constraints: false,
      });
      // load all healthStats
      db.patient
        .findAll({
          include: [{ model: db.healthStats }, { model: db.savedRecipes }],
        })
        .then(patient => {
          let hbsPatient = { patients: patient.map(x => x.dataValues) };
          res.render('doctor', hbsPatient);
        });
    },

    getAllPatients: (req, res) => {
      db.patient.findAll({}).then(patient => {
        hbsObj = { patients: patient.map(x => x.dataValues) };
        res.render('doctor', hbsObj);
      });
    },

    getOnePatient: (req, res) => {
      db.patient.belongsTo(db.healthStats, {
        foreignKey: 'id',
        constraints: false,
      });
      db.patient.belongsTo(db.savedRecipes, {
        foreignKey: 'id',
        constraints: false,
      });
      // load all healthStats
      db.patient
        .findAll({
          where: { user_name: 'JohnDoe' },
          include: [{ model: db.healthStats }, { model: db.savedRecipes }],
        })
        .then(patient => {
          let hbsPatient = { patients: patient.map(x => x.dataValues) };
          res.render('doctor', hbsPatient);
        });
    },

    createPatient: (req, res) => {
      req.checkBody('patient_name', 'Username field cannot be empty.').notEmpty();
      req
        .checkBody(
          'patient_name',
          'Username must be between 4-15 characters long.',
        )
        .len(4, 15);
      const errors = req.validationErrors();

      if (errors) {
        res.render('doctor', { errors: errors });
      } else {
        const {
          body: {
            patient_name,
            password,
            risk_factor,
            diet_recommendation,
            diet_restriction,
          },
        } = req;
        // Create an patient with the data available to us in req.body
        db.patient.belongsTo(db.healthStats, {
          foreignKey: 'id',
          constraints: false,
        });
        db.patient.create({
          patient_name,
          user_name: 'default_username',
          password,
        }),
          db.healthStats
            .create({
              patient_id: db.patient.id,
              risk_factor,
              diet_recommendation,
              diet_restriction,
            })
            .then(() => {
              res.redirect('/doctor/form');
            });
      }
    },

    deletePatient: (req, res) => {
      db.patient
        .destroy({
          where: {
            id: req.params.id,
          },
        })
        .then(() => {
          res.send({ id: req.params.id });
        });
    },
}