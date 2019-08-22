const path = require('path');
const controller = require('../controllers/abttruController');

module.exports = function(app) {
  app.get('/home', function(req, res) {
    res.render(path.join(__dirname, '../views/home-page.handlebars'));
  });

  // ********* USER ROUTES ********** //
  app.post('/profile', controller.userLogin);
  app.get('/profile', controller.userDashboard);
  // ********** RECIPES ********** //
  app.post('/profile/save', controller.saveRecipe);
  app.put('/profile/fave', controller.faveRecipe);
  app.delete('/profile/delete', controller.deleteRecipe);

  // ********** DOCTOR ROUTES ********** //
  app.post('/doctor', controller.doctorLogin);
  app.get('/doctor/form', controller.doctorDashboard);
  app.get('/patient/list', controller.getAllPatients);
  app.get('/api/patient/:patient_name', controller.getOnePatient);
  app.post('/api/patient', controller.createPatient);
  app.delete('/api/patient/:id', controller.deletePatient);
};
