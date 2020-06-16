// const axios = require('axios');
const db = require('../models');
// const passport = require('../config/auth/passport');

// const appId = process.env.EDAMAME_APP_ID;
// const appKey = process.env.EDAMAME_API_KEY;

module.exports = {
  // passportLogin: () => (passport.authenticate('local'), (req, res) => {
  //   const patient = res.shift();
  //   const { dataValues: { id } } = patient;
  //   req.session.isAuthenticated = true;
  //   res.redirect(`/profile/${id}`);
  // }),

  userLogin: (req, res) => {
    const { body: { email, password } } = req;
    return db.Patient.findOne({ where: { email } }).then(user => {
      if (!user) {
        res.redirect('/');
      } else {
        user.validatePassword(password, (err, isMatch) => {
          if (isMatch) {
            const { dataValues: { id } } = user;

            req.session.isLoggedIn = true;
            res.redirect(`/profile/${id}`);
          } else {
            res.status(403).json(err);
          }
        });
      }
    }).catch(err => console.error(err));
  },

  userDashboard: (req, res) => {
    const scripts = [
      { script: '/js/userInfo.js' },
      { script: 'https://cdn.plot.ly/plotly-latest.min.js' },
    ];
    const links = [{ link: '/css/style.css' }];

    return db.Patient.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { id: req.params.id },
      include: [
        { model: db.Statistics, as: 'statistics' },
        { model: db.Recipes, as: 'recipes' },
      ],
    })
      .then(patient => {
        const hbsPatient = {
          ...patient.dataValues,
          ...patient.statistics.dataValues,
          recipes: patient.recipes.map(recipe => (recipe.dataValues)),
          faveRecipe: [],
          scripts,
          links,
        };

        res.render('patient', hbsPatient);
      })
      .catch(error => {
        res.send(error);
      });
  },

  // getOneSaved: (req, res) => {
  //   const { params: { id } } = req;
  //   db.Recipes.findOne({ where: { id } })
  //     .then(recipe => {
  //       const recipeUri = recipe.dataValues.recipe_uri;
  //       const encodedUri = encodeURI(recipeUri);
  //       hbsPatient.recipes = db.Recipes.map(x => x.dataValues);
  //       axios
  //         .get(
  //           `https://api.edamam.com/search?r='${encodedUri}&app_id=${appId}&app_key=${appKey}`
  //         )
  //         .then(response => {
  //           console.log(response.data);
  //         });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // },

  saveRecipe: (req, res) => {
    const {
      body: {
        patientId,
        recipeName,
        recipeImg,
        recipe,
        recipeUri,
      },
    } = req;
    db.Recipes.create({
      patientId,
      recipeName,
      recipeImg,
      recipe,
      recipeUri,
    }).then(newRecipe => {
      if (req.body.favorite) {
        return module.exports.faveRecipe(req, res);
      }
      return res.send(newRecipe);
    });
  },

  faveRecipe: (req, res) => {
    const { body: { id, favorite, recipe } } = req;
    return db.Recipes.findOne({ where: { patientId: id, recipe } })
      .then(record => {
        if (!record) {
          return module.exports.saveRecipe(req, res);
        }
        return db.Recipes.update(
          { favorite: false },
          { where: { favorite: true, patientId: id } }
        ).then(() => db.Recipes.update(
          { favorite },
          { where: { patientId: id, recipe } }
        ).then(newFavorite => res.send(newFavorite)));
      });
  },

  deleteRecipe: req => {
    const { body: { id, uri } } = req;
    return db.Recipes.destroy({
      where: {
        patientId: id,
        recipeUri: uri,
      },
    });
  },
};
