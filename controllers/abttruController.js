const db = require('../models');
const axios = require('axios');

module.exports = {
  userLogin: (req, res) => {
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

  userDashboard: (req, res) => {
    const scripts = [
      { script: '/js/user-info.js' },
      { script: 'https://cdn.plot.ly/plotly-latest.min.js' },
    ];
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
          })
          .then(() => {
            res.render('patient-page', hbsPatient);
          });
      })
      .catch(error => {
        res.send(error);
      });
  },

  getOneSaved: (req, res) => {
    const {
      params: { id },
    } = req;
    db.savedRecipes
      .findOne({
        where: { id },
      })
      .then(savedRecipe => {
        const recipeUri = savedRecipe.dataValues.recipe_uri;
        const encodedUri = encodeURI(recipeUri);
        hbsPatient.recipes = savedRecipes.map(x => x.dataValues);
        axios
          .get(
            'https://api.edamam.com/search?r=' +
              encodedUri +
              '&app_id=' +
              process.env.EDAMAME_APP_ID +
              '&app_key=' +
              process.env.EDAMAME_API_KEY,
          )
          .then(response => {
            console.log(response.data);
          });
      })
      .catch(error => {
        console.log(error);
      });
  },

  saveRecipe: (req, res) => {
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
      .then(newRecipe => {
        if (req.body.favorite) {
          return module.exports.faveRecipe(req, res);
        }
        res.send(newRecipe);
      });
  },

  faveRecipe: (req, res) => {
    const {
      body: { id, favorite, recipe },
    } = req;
    db.savedRecipes
      .findOne({
        where: { patient_id: id, recipe },
      })
      .then(record => {
        if (!record) {
          return module.exports.saveRecipe(req, res);
        }
        return db.savedRecipes
          .update(
            { favorite: false },
            { where: { favorite: true, patient_id: id } },
          )
          .then(() => {
            return db.savedRecipes
              .update({ favorite }, { where: { patient_id: id, recipe } })
              .then(newFavorite => {
                return res.send(newFavorite);
              });
          });
      });
  },

  deleteRecipe: (req, res) => {
    return db.savedRecipes.destroy({
      where: {
        patient_id: req.body.id,
        recipe_uri: req.body.uri,
      },
    });
  },

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
        res.render('doctor-page', hbsPatient);
      });
  },

  getAllPatients: (req, res) => {
    db.patient.findAll({}).then(patient => {
      hbsObj = { patients: patient.map(x => x.dataValues) };
      res.render('doctor-page', hbsObj);
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
        res.render('doctor-page', hbsPatient);
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
};
