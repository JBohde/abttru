const db = require('../models');
const axios = require('axios');
let faveRecipe;

module.exports = {
  userLogin: function(req, res) {
    const userName = req.body.patient_name;
    const userPassWord = req.body.password;

    db.patient
      .findAll({
        where: {
          patient_name: userName,
          password: userPassWord,
        },
      })
      .then(results => {
        if (results.length == 0) {
          res.redirect('/');
        } else {
          const patient = results.shift();
          const {
            dataValues: { id },
          } = patient;
          req.session.user_name = userName;
          res.redirect(`/profile/${id}`);
        }
      });
  },

  userDashboard: function(req, res) {
    const scripts = [{ script: '/js/user-info.js' }];
    const links = [{ link: '/css/style.css' }];
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
        where: { id: req.params.id },
        include: [{ model: db.healthStats }, { model: db.savedRecipes }],
      })
      .then(patient => {
        let hbsPatient = {
          patients: patient.map(x => x.dataValues),
          recipes: [],
          faveRecipe: [],
          scripts,
          links,
        };
        db.savedRecipes
          .findAll({
            where: { patient_id: patient.map(x => x.dataValues.id).toString() },
          })
          .then(savedRecipes => {
            hbsPatient.recipes = savedRecipes.map(x => x.dataValues);
            // let recipeName = savedRecipes.map(x => x.dataValues.recipe_name);
            // let recipeImg = savedRecipes.map(x => x.dataValues.recipe_img);
            // let recipeUrl = savedRecipes.map(x => x.dataValues.recipe);
            // let recipeUri = savedRecipes.map(x => x.dataValues.recipe_uri);
            // let encodedUri = encodeURI(recipeUri[0]);

            // axios.get('https://api.edamam.com/search?r=' + encodedUri + '&app_id=76461587&app_key=b829a690de0595f2fa5b7cb02db4cd99')
            //     .then(response => {
            //         faveRecipe = response.data;
            //         console.log(faveRecipe)
            //     }).catch(error => {
            //         console.log(error);
            // });
          })
          .then(() => {
            res.render('patient-page', hbsPatient);
          });
      })
      .catch(function(error) {
        res.send(error);
      });
  },

  saveRecipe: function(req, res) {
    const {
      body: { id, recipe_name, recipe_img, recipe, recipe_uri },
    } = req;
    db.savedRecipes
      .create({
        patient_id: id,
        recipe_name,
        recipe_img,
        recipe,
        recipe_uri,
      })
      .then(function(savedRecipe) {
        res.send(savedRecipe);
      });
  },

  faveRecipe: function(req, res) {
    const {
      body: { id, favorite, recipe },
    } = req;
    db.savedRecipes
      .update(
        { favorite: false },
        {
          where: {
            favorite: true,
            patient_id: id,
          },
        },
      )
      .then(function() {
        db.savedRecipes
          .update(
            { favorite },
            {
              where: {
                patient_id: id,
                recipe,
              },
            },
          )
          .then(function(savedRecipe) {
            res.send(savedRecipe);
          });
      });
  },

  deleteRecipe: function(req, res) {
    return db.savedRecipes.destroy({
      where: {
        patient_id: req.body.id,
        recipe_uri: req.body.uri,
      },
    });
  },

  // ******* DOCTOR ROUTES ******* //
  doctorLogin: function(req, res) {
    var doctorName = req.body.doctor_name;
    var password = req.body.password;

    db.doctor
      .findAll({
        where: {
          doctor_name: doctorName,
          password: password,
        },
      })
      .then(function(response) {
        var doctorObj = response;
        if (doctorObj.length == 0) {
          res.redirect('/');
        } else {
          req.session.doctor_name = doctorName;
          res.redirect('/doctor/form');
        }
      });
  },

  doctorDashboard: function(req, res) {
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
        res.render('doctor-page', hbsPatient);
      });
  },

  getAllPatients: function(req, res) {
    db.patient.findAll({}).then(patient => {
      hbsObj = { patients: patient.map(x => x.dataValues) };
      res.render('doctor-page', hbsObj);
    });
  },

  getOnePatient: function(req, res) {
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
        res.render('doctor-page', hbsPatient);
      });
  },

  createPatient: function(req, res) {
    req.checkBody('patient_name', 'Username field cannot be empty.').notEmpty();
    req
      .checkBody(
        'patient_name',
        'Username must be between 4-15 characters long.',
      )
      .len(4, 15);
    const errors = req.validationErrors();

    if (errors) {
      res.render('doctor-page', { errors: errors });
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

  deletePatient: function(req, res) {
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
};
