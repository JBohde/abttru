const db = require('../models');
const axios = require('axios');
const passport = require("../config/passport");

module.exports = {
  passportLogin: () => {
    passport.authenticate("local"),(req, res) => {
      // res.json(req.user);
      const patient = res.shift();
      const { dataValues: { id } } = patient;
      req.session.user_name = userName;
      res.redirect(`/profile/${id}`);
    }
  },

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
          const { dataValues: { id } } = patient;
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
            res.render('patient', hbsPatient);
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


};