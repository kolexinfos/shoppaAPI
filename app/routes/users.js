var express = require('express');
var router = express.Router();
var User = require('../models/user');
var hasher = require('wordpress-hash-node');
const jwt = require('jsonwebtoken');
const config = require('../../config/main');


/* GET users listing. */
router.get('/', function(req, res, next) {
    var password = 'Funnys5140';
    var hash = hasher.CheckPassword(password,"$P$Dum0FQSFevBGocOlp/l75QhdQkv21e0");
  res.json( hash );
});

router.post('/register', function(req, res) {
  console.log(req.body);
  if(!req.body.email || !req.body.password) {
    res.status(400).json({ success: false, message: 'Please enter email and password.' });
  } else {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    // Attempt to save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(400).json({ success: false, message: 'That email address already exists.'});
      }
      res.status(201).json({ success: true, message: 'Successfully created new user.' });
    });
  }
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/authenticate', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          const token = jwt.sign(user, config.secret, {
            expiresIn: 10080 // in seconds
          });
          res.status(200).json({ success: true, token: 'JWT ' + token });
        } else {
          res.status(401).json({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});


module.exports = router;
