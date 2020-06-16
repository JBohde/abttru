module.exports = () => {
  isAuthenticated = (req, res, next) => {
    if (req.session.loggedIn) {
      next(); // allow the next route to run
    } else {
    // require the user to log in
      res.redirect('/login'); // or render a form, etc.
    }
  };
};
