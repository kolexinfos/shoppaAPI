// Include our packages in our main server file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');


const jwt = require('jsonwebtoken');

const config = require('./config/main');
const cors = require('cors');
const port = 3000;

app.use(cors());

const requireAuth = passport.authenticate('jwt', { session: false });

// Initialize passport for use
app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./config/passport')(passport);

var users = require('./app/routes/users');
var campaigns = require('./app/routes/campaigns');
var brands = require('./app/routes/brands');
var misc = require('./app/routes/misc');


// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Log requests to console
app.use(morgan('dev'));

// Home route. We'll end up changing this to our main front end index later.
app.get('/', function(req, res) {
  res.json('Relax. We will put the home page here later.');
});

// Connect to database
mongoose.connect(config.database);


app.use('/users', users);
//app.use('/campaigns',requireAuth, campaigns);
app.use('/campaigns', campaigns);

app.use('/brands', brands);
app.use('/misc', misc);


module.exports = app;
