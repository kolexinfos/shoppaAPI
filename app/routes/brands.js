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
    
    if(!req.body.name || !req.body.category || !req.body.description || !req.body.enabled || !req.body.image || !req.body.tags)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else
    {
        const brand = new Brand({
           name: req.body.name,
           category: req.body.category,
           description: req.body.description,
           enabled: req.body.enabled,
           image: req.body.image,
           tags: req.body.tags
        });
        
        brand.save(function(err){
            if(err)
            {
                console.log(err);
                return res.status(400).json({ success: false, message: 'An error occurred on trying to save campaign, please try again later ' + err});
            }

            res.status(201).json({ success: true, message: 'Successfully created Brand ' + req.body.name });
        })
     
    }
});

router.post('/like', function(req, res){
    console.log(req.body);

    if(!req.body.email || !req.body.brandid)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else{
    console.log( moment.utc().format('YYYY-MM-DD HH:mm:ss'));
    
    Brand.findOneAndUpdate({_id:req.body.brandid}, { $push: { likes : {"email" : req.body.email, "timestamp" : moment.utc().format('YYYY-MM-DD HH:mm:ss') } } }, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to update campaign ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully added users to the list of user likes for this campaign ' });
    })
    }
});

router.post('/share', function(req, res) {
    
});

router.post('/follow', function(req, res) {
    
});

module.exports = router;