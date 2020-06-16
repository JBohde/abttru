const db = require('../models');
// const passport = require('../config/auth/passport');

module.exports = {
  doctorLogin: (req, res) => {
    const {
      body: { email, password },
    } = req;
    db.Doctor.findOne({ where: { email } }).then(doctor => {
      if (!doctor) {
        res.redirect('/');
      } else {
        doctor.validatePassword(password, (err, isMatch) => {
          if (isMatch) {
            const {
              dataValues: { id },
            } = doctor;
            req.session.isLoggedIn = true;
            res.redirect(`/doctor/${id}/form`);
          } else {
            res.status(403).json(err);
          }
        });
      }
    });
  },

  doctorDashboard: (req, res) => {
    db.Doctor.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { id: req.params.id },
      include: [
        {
          model: db.Patient,
          as: 'patients',
          include: [{ model: db.Statistics, as: 'statistics' }],
        },
      ],
    }).then(doctor => {
      const {
        dataValues: {
          id,
          firstName,
          lastName,
          email,
          patients
        },
      } = doctor;
      const hbsDoctor = {
        id,
        firstName,
        lastName,
        email,
        createPatientLink: `/api/${id}/patient`,
        redirectLink: `/doctor/${id}/form`,
        patients: patients.map(patient => ({
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          ...patient.statistics.dataValues,
        })),
      };

      res.render('doctor', hbsDoctor);
    });
  },

  getAllPatients: (req, res) => {
    db.Patient.findAll({}).then(patient => {
      const hbsObj = { patients: patient.map(x => x.dataValues) };
      res.render('doctor', hbsObj);
    });
  },

  getOnePatient: (req, res) => {
    // load all Statistics
    db.Patient.findAll({
      where: { user_name: 'JohnDoe' },
      include: [{ model: db.Statistics }, { model: db.Recipes }],
    }).then(patient => {
      const hbsPatient = { patients: patient.map(x => x.dataValues) };
      res.render('doctor', hbsPatient);
    });
  },

  createPatient: (req, res) => {
    // req.checkBody('firstName', 'First name field cannot be empty.').notEmpty();
    // req
    //   .checkBody(
    //     'patient_name',
    //     'Username must be between 4-15 characters long.'
    //   )
    //   .len(4, 15);
    // const errors = req.validationErrors();

    // if (errors) {
    //   return res.render('doctor', { errors });
    // }
    const {
      body: {
        firstName,
        lastName,
        email,
        password,
        riskFactor,
        dietRecommendation,
        dietRestriction,
      },
      params: { doctor }
    } = req;

    return db.Patient.create({
      firstName,
      lastName,
      email,
      password,
      doctorId: doctor,
    })
      .then(patient => db.Statistics.create({
        patientId: patient.id,
        riskFactor,
        dietRecommendation,
        dietRestriction,
      }))
      .then(() => {
        res.redirect(`/doctor/${doctor}/form`);
      });
  },

  deletePatient: (req, res) => {
    db.Patient.destroy({ where: { id: req.params.id } }).then(() => {
      res.send({ id: req.params.id });
    });
  },
};
