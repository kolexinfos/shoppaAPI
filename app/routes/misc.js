var express = require('express');
var router = express.Router();
var Misc = require('../models/misc');
var moment = require('moment');
var _ = require('lodash');


router.get('/', function(req,res){
    res.status(200).json({success: true, message: 'Misc Home Route'});
});

router.post('/createReport', function (req, res) {
    
    if(!req.body.title || !req.body.email || !req.body.phone || !req.body.message || !req.body.type)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else
    {
        const misc = new Misc({
           title: req.body.title,
           email: req.body.email,
           phone: req.body.phone,
           message: req.body.message,
           type:    req.body.type
        });
        
        misc.save(function(err){
            if(err)
            {
                console.log(err);
                return res.status(400).json({ success: false, message: 'An error occurred on trying to save Report, please try again later ' + err});
            }

            res.status(201).json({ success: true, message: 'Successfully created Report ' + req.body.title });
        })
     
    }
});

module.exports = router;