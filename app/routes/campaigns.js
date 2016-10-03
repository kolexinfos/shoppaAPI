var express = require('express');
var router = express.Router();
var Campaign = require('../models/campaign');


/* GET home page. */
router.get('/', function (req, res) {
    console.log(req);

    Campaign.find({}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully pulled the Campaigns ' });
    })

});

router.post('/', function (req, res) {
    console.log(req.body);

    if(!req.body.name || !req.body.type || !req.body.description || !req.body.enabled || !req.body.expiring || !req.body.likes
        || !req.body.image || !req.body.tags || !req.body.wantin || !req.body.thumbnail)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else
    {
        const campaign = new Campaign({
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            enabled : req.body.enabled,
            expiring : req.body.expiring,
            likes : req.body.likes,
            image : req.body.image,
            thumbnail:req.body.thumbnail,
            tags : req.body.tags,
            wantin: req.body.wantin
        });

        console.log('Saving Campaign :  ' + req.body.name);

        campaign.save(function(err){
            if(err)
            {
                console.log(err);
                return res.status(400).json({ success: false, message: 'An error occurred on trying to save campaign, please try again later ' + err});
            }

            res.status(201).json({ success: true, message: 'Successfully created Campaign ' + req.body.name });
        })
    }

});


//Update Campaign details
router.put('/', function(req, res){
    console.log(req);

    if(!req.body.field || !req.body.value || !req.body.newValue){
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }

    var field = req.body.field;
    var value = req.body.value;
    Campaign.findOne({field :value }, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

    })
});

//Get the top trending campaigns on Shoppa
router.get('/getTopCampaigns', function (req, res) {
    console.log(req);

    Campaign.find({likes: { $gte: 10 }}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully created Campaign ' + req.body.name });
    })

});

/*
Get campaigns that users have opt in for on Shoppa
*/
router.get('/getUserCampaigns', function (req, res) {

    res.sendStatus(200);

});

/*
Get expiring campaigns by number of days

*/

router.get('/getExpiringCampaigns', function (req, res) {

    res.sendStatus(200);

});

module.exports = router;
