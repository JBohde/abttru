const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

const app = express();
const expressValidator = require('express-validator');
var db = require('./models');
const session = require('express-session');
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.use(expressValidator());

app.use(
  session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 } }),
);

// Set Handlebars.
const exphbs = require('express-handlebars');

app.engine(
  'handlebars',
  exphbs({ defaultLayout: 'main', extname: 'handlebars' }),
);
app.set('view engine', 'handlebars');

// Import routes and give the server access to them.
const abttruRoutes = require('./routes/abttruRoutes')(app);
app.use(express.static('/home', abttruRoutes));

app.get('/', (req, res) => {
  res.redirect('/home');
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
