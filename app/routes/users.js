var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Verify = require('../models/verify');
var hasher = require('wordpress-hash-node');
const jwt = require('jsonwebtoken');
const config = require('../../config/main');
var nodemailer = require('nodemailer');
var moment = require('moment');


/* GET users listing. */
router.get('/test', function(req, res, next) {
    var password = re.body.password || '';
    var hash = hasher.CheckPassword(password,"$P$Dum0FQSFevBGocOlp/l75QhdQkv21e0");
  res.json( hash );
});

router.post('/verifyEmail', function(req, res, next) {
  console.log(req.body);

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate());
  cutoff.setHours(cutoff.getHours - 1);

  if(!req.body.email || !req.body.code ){
    res.status(400).json({ success: false, message: 'Please make sure you sent email and code.' });
  }
  else{
    Verify.find({email: req.body.email,token:req.body.token, createdAt: {$lt: cutoff}}, function(err, result)
    {
      if (err) throw err;

      if (!result) {
        res.status(401).json({success: false, message: 'Token not found'});
      }
      else {
        res.status(200).json({success: true, message: 'A valid Token was found for user'});
      }
    }
  );

  }


});

router.post('/register', function(req, res) {
  console.log(req.body);
  if(!req.body.email || !req.body.password || !req.body.username || !req.body.phone) {
    res.status(400).json({ success: false, message: 'Please make sure you enter email, phone, username and password.' });
    console.log('Missing Parameter');
  } else {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      username:req.body.username
    });

    console.log('Saving user ' + req.body.email + ' ' + req.body.username);
    // Attempt to save the user
    newUser.save(function(err) {

      if (err) {
        return res.status(400).json({ success: false, message: 'That email address already exists.'});
      }

      //Send email to user with code and save to DB
      ValidateUser(newUser);

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

function ValidateUser(user){
  console.log('Setting up user validation for' + user.email);

  var token = Math.floor(Math.random() * 90000) + 10000
  var email = user.email;

  const verify = new Verify({
    email: email,
    token: token
  });

  verify.save(function(err){
    if(err){
      return res.status(400).json({ success: false, message: 'Could not save token'});
    }
    console.log('User token was saved for ' + user.email);
  });

  var name = user.username;
  var from = 'admin@shoppa.com';
  var message = 'Please find below the 5 digit token' + token;
  var to = user.email;

  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      XOAuth2: {
        user: "kolexinfos@gmail.com",
        clientId: "126468130105-ss5kpd1ji8sarpon5bh0m38fvpssup1d.apps.googleusercontent.com",
        clientSecret: "-f1wpkIIcz2X5BPA0eAUGqfe",
        refreshToken: "1/Xs5m3FTZQoPB23jgOG8MFbtFlF_Q3uw6uVXEPEj3yf0"
      }
    }
  });

  var mailOptions = {
    from: from,
    to: to,
    subject: name+' | Email Validation Token !',
    text: message
  }
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log('Email Sent to ' + user.email);

    }
  });


}


module.exports = router;
