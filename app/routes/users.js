var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Verify = require('../models/verify');
var hasher = require('wordpress-hash-node');
const jwt = require('jsonwebtoken');
const config = require('../../config/main');
var nodemailer = require('nodemailer');
var moment = require('moment');
var smtpTransport = require('nodemailer-smtp-transport');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var S3FS = require("s3fs");
var fs = require("fs");
var s3fsImpl = S3FS('234radious',{
  accessKeyId : 'AKIAJK6PNVHPCDZPJVEA',
  secretAccessKey : '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'
})

//AWS.config.update({ accessKeyId: 'AKIAJK6PNVHPCDZPJVEA', secretAccessKey: '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' });

var awsLink = 'https://s3.amazonaws.com/234radious/';


/* GET users listing. */
router.get('/test', function(req, res, next) {
    var password = req.body.password || '';
    var hash = hasher.CheckPassword(password,"$P$Dum0FQSFevBGocOlp/l75QhdQkv21e0");
  res.json( hash );
});

/* GET usegrs listing. */
router.post('/upload', upload.single('file'), function(req, res, next) {
  
    var stream = fs.createReadStream(req.file.path);
   
    console.log('/uploads/' + req.file.originalname);
    //console.log(req.file);
    
    s3fsImpl.writeFile(req.file.originalname, stream)
    .then(function() {
        console.log('It\'s saved!');
      }, function(reason) {
        throw reason;
      });
   
    res.status(201).json({success: true, message: req.file});
});


/* POST Send Email. */
router.post('/sendEmail', function(req, res, next) {
   if(!req.body.title || !req.body.message || !req.body.email || !req.body.type || !req.body.filename || !req.body.phone ){
    console.log(req.body);
    res.status(400).json({ success: false, message: 'Please make sure you send title, type, message, filename and email as parameters to this endpoints' });
  }
  else {

    const transportOptions = {
      service: 'gmail',
      auth: {
        user: '234radiomail',
        pass: 'Ftp@234radio'
      }
    };

    //const transportStrategy = SMTPTransport(transportOptions);
    var transport = nodemailer.createTransport('SMTP', transportOptions);
    
    console.log(awsLink + req.body.filename);

    var from = '<html><body>info@234radio.com';
    var message = '<b>Find details of a message from the 234Radio App</b>'
        + String.fromCharCode(13) + '<p>Type : ' + req.body.type + '</p>'
        + String.fromCharCode(13) + '<p>Title : ' + req.body.title + '</p>'
        + String.fromCharCode(13) + '<p>Message : ' + req.body.message + '</p>'
        + String.fromCharCode(13) + '<p>User Email : ' + req.body.email + '</p>'
        + String.fromCharCode(13) + '<p>User Phone : ' + req.body.phone + '</p>'
        + String.fromCharCode(13) + '<p>Attached Media <img src="' + awsLink + req.body.filename + '"></p></body></html>';
    var to = 'ddjokay@gmail.com';
    
    //<img src="list_image_url_here">

    var mailOptions = {
      transport: transport,
      from: from,
      to: to,
      subject: 'Message from 234Radio App',
      //text: message,
      html:message,
      attachments: [
          {   // use URL as an attachment
            filename: 'file',
            path: awsLink + req.body.filename
        }
        ]
    
    };

    transport.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log("Error Full : " + error);
      } else {
        console.log('Email Sent for ' + req.body.email);
        console.log('Email Sent for ' + awsLink + req.body.filename);
        res.status(201).json({success: true, message: 'The Email has been sent'});
      }
    });


     //var smtpTransport = nodemailer.createTransport('SMTP', {
     //  host: 'mail.234radio.com',
     //  port: 25,
     //  secure : true,
     //  auth: {
     //    user: 'info@234radio.com',
     //    pass: 'Ftp@234radio'
     //  }
     //});
     //var smtpTransport = nodemailer.createTransport('SMTP', {
     //  host: 'server42.web-hosting.com',
     //  port: 25,
     //  secure : false,
     //  auth: {
     //    user: 'admin@mart.com.ng',
     //    pass: 'Admin1234'
     //  }
     //});


    
   

  //   var smtpTransport = nodemailer.createTransport("SMTP", {
  //  service: "Gmail",
  //  auth: {
  //    XOAuth2: {
  //      user: "kolexinfos@gmail.com",
  //      clientId: "126468130105-ss5kpd1ji8sarpon5bh0m38fvpssup1d.apps.googleusercontent.com",
  //      clientSecret: "-f1wpkIIcz2X5BPA0eAUGqfe",
  //      refreshToken: "1/Xs5m3FTZQoPB23jgOG8MFbtFlF_Q3uw6uVXEPEj3yf0"
  //    }
  //  }
  //});
  //
  
  }
  
  
});

router.post('/verifyEmail', function(req, res, next) {
  console.log(req.body);
  
  if(!req.body.email || !req.body.code ){
    console.log(req.body);
    res.status(400).json({ success: false, message: 'Please make sure you sent email and code.' });
  }
  else{
    Verify.findOne({email: req.body.email,token:req.body.code}, function(err, result)
    {
      if (err) throw err;

      if (!result) {
        console.log(result);
        res.status(401).json({success: false, message: 'Token not found'});
      }
      else {
        console.log(result.createdAt);
        
        var initDate = moment(result.createdAt);
        var now = moment({});

        console.log(initDate);
        console.log(now);
        
        var duration = moment.duration(now.diff(initDate));
        var hours = duration.asHours();
        
        console.log(hours);
        if(hours < 1) {
          User.findOneAndUpdate({email:req.body.email},{ $set: { verified: true }}, function(err,user){
              if(err)
              {
                return res.status(400).json({ success: false, message: 'An error occurred on trying to update the User verified field'});
              }
              else
              {

              }
          });
          res.status(201).json({success: true, result: result, message: 'A valid Token was found for user'});
        }
        else{
          res.status(401).json({success: false, result: result, message: 'The token has expired'});
        }
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

  if(!req.body.email || !req.body.password ){
    console.log(req.body);
    res.status(400).json({ success: false, message: 'Please make sure you sent email and password.' });
  }

  User.findOne({
    email: req.body.email,
    verified:true
  }, function(err, user) {

    if (err) {
      return res.status(400).json({ success: false, message: 'An error occurred' + err});
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Authentication failed. User not found or email not verified' });
    } else {
      // Check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          // Create token if the password matched and no error was thrown
          const token = jwt.sign(user, config.secret, {
            expiresIn: 10080 // in seconds
          });
          res.status(200).json({ success: true,message:'Authentication Successful.', token: 'JWT ' + token });
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
  var message = 'Please find below the 5 digit token ' + token;
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

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/skill', function(req, res) {
  console.log(req.body);
  
  
  res.status(200).json({ success: true,message:'Report Submitted Successfully.' });
  
});




module.exports = router;














