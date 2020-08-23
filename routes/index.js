const path = require('path');

const passport = require('../config/auth/passport');
const isAuthenticated = require('../config/auth/isAuthenticated');

const DoctorController = require('../controllers/DoctorController');
const PatientController = require('../controllers/PatientController');
// const isAuthenticated = require('../auth');

module.exports = app => {
  app.get('/', (req, res) => {
    if (req.user) {
      res.redirect(`/profile/${req.user.id}`);
    } else {
      res.redirect('/login');
    }
  });

  app.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../views/login.handlebars'));
  });
  // Route for logging user out
  app.get('/logout', PatientController.logout);

  // ********* USER ROUTES ********** //
  app.post('/profile', passport.authenticate('local'), PatientController.login);
  app.get('/profile/:id', isAuthenticated, PatientController.userDashboard);

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
