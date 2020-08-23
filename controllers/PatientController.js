const axios = require('axios');

const { Patient, Recipes, Statistics } = require('../models');

const appId = process.env.EDAMAME_APP_ID;
const appKey = process.env.EDAMAME_API_KEY;

module.exports = {
  login(req, res) {
    const { dataValues: { id } } = req.user;
    req.session.isAuthenticated = true;
    res.redirect(`/profile/${id}`);
  },

  logout: (req, res) => {
    req.logout();
    res.redirect('/');
  },

  userDashboard(req, res) {
    const scripts = [
      { script: 'https://cdn.plot.ly/plotly-latest.min.js' },
      { script: '/js/plotly.js' },
      { script: '/js/userInfo.js' },
    ];
    const links = [{ link: '/css/style.css' }];

    return Patient.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { id: req.params.id },
      include: [
        { model: Statistics, as: 'statistics' },
        { model: Recipes, as: 'recipes' },
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

  getOneSaved(req, res) {
    const { params: { id } } = req;
    Recipes.findOne({ where: { id } })
      .then(recipe => {
        const recipeUri = recipe.dataValues.recipe_uri;
        const encodedUri = encodeURI(recipeUri);
        axios
          .get(
            `https://api.edamam.com/search?r='${encodedUri}&app_id=${appId}&app_key=${appKey}`
          )
          .then(response => {
            console.log(response.data);
          });
      })
      .catch(error => {
        res.send(error);
      });
  },

  saveRecipe(req, res) {
    const {
      body: {
        patientId,
        recipeName,
        recipeImg,
        recipe,
        recipeUri,
      },
    } = req;
    Recipes.create({
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

  faveRecipe(req, res) {
    const { body: { patientId, favorite, recipe } } = req;
    return Recipes.findOne({ where: { patientId, recipe } })
      .then(record => {
        if (!record) {
          return module.exports.saveRecipe(req, res);
        }
        return Recipes.update(
          { favorite: false },
          { where: { favorite: true, patientId: id } }
        ).then(() => Recipes.update(
          { favorite },
          { where: { patientId: id, recipe } }
        ).then(newFavorite => res.send(newFavorite)));
      });
  },

  deleteRecipe(req) {
    const { body: { id, uri } } = req;
    return Recipes.destroy({
      where: {
        patientId: id,
        recipeUri: uri,
      },
    });
  },
};
