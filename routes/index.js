const path = require('path');
const DoctorController = require('../controllers/DoctorController');
const PatientController = require('../controllers/PatientController');
// const isAuthenticated = require('../auth');

module.exports = app => {
  app.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../views/login.handlebars'));
  });

  // ********* USER ROUTES ********** //
  // app.post('/profile', PatientController.passportLogin);
  app.post('/profile', PatientController.userLogin);
  app.get('/profile/:id', PatientController.userDashboard);

  // ********** RECIPES ********** //
  app.post('/profile/save', PatientController.saveRecipe);
  app.put('/profile/fave', PatientController.faveRecipe);
  app.delete('/profile/delete', PatientController.deleteRecipe);

  // ********** DOCTOR ROUTES ********** //
  app.post('/doctor', DoctorController.doctorLogin);
  app.get('/doctor/:id/form', DoctorController.doctorDashboard);
  app.get('/patient/list', DoctorController.getAllPatients);
  app.get('/api/patient/:id', DoctorController.getOnePatient);
  app.post('/api/:doctor/patient', DoctorController.createPatient);
  app.delete('/api/patient/:id', DoctorController.deletePatient);
};
