const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

var db = require('./models');
const session = require('express-session');
var passport = require("./config/auth/passport");

const PORT = process.env.PORT || 8080;

const app = express();
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(path.join(__dirname, '/public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(expressValidator());

app.use(session({
  secret: 'this-is-a-secret-token',
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: 'handlebars' }));
app.set('view engine', 'handlebars');

// Import routes and give the server access to them.
const routes = require('./routes')(app);
app.use(express.static('/login', routes));

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Start our server so that it can begin listening to client requests.
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log(
      'Express server listening on port %d in %s mode',
      this.address().port,
      app.settings.env,
    );
  });
});
