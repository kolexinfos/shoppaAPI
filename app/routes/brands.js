var express = require('express');
var router = express.Router();
var Campaign = require('../models/campaign');
var Brand = require('../models/brand');
var moment = require('moment');
var _ = require('lodash');


/* GET campaigns default get route page. */
router.get('/', function (req, res) {

    Brand.find({}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        else{
            
            res.status(201).json({ success: true,result:result, message: 'Successfully pulled the Campaigns ' });
        }
    });

});

router.post('/', function (req, res) { 
    
});

module.exports = router;