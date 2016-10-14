var express = require('express');
var router = express.Router();
var Campaign = require('../models/campaign');


/* GET campaigns default get route page. */
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

    if(!req.body.name || !req.body.type || !req.body.description || !req.body.enabled || !req.body.expiring
        || !req.body.image || !req.body.tags || !req.body.wantin )
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
Get campaigns that would displayed on user timeline
*/
router.post('/getUserCampaigns', function (req, res) {

    console.log(req);
    var likes = [String];


    if(!req.body.email)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }

    Like.find({}, function(err,result){
        if(err)
        {
            //console.log(err);
            return res.status(400).json({success: false, message: 'An error occurred on trying to pull Likes ' + err})
        }
        else {
            for (var i = 0; i < result.length; i += 1) {
                likes.push(result[i].campaignId);
            }


            //Get all campaigns that user has not liked or opted in to
            Campaign.find({email: {$nin: likes}}, function (err, result) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: 'An error occurred on trying to pull the campaigns ' + err
                    });
                }

                res.status(201).json({success: true, result: result, message: 'Successfully pulled the Campaigns '});
            });
        }
        });


});

/*
Get Campaigns liked by User
*/
router.get('/getUserCampaignLikes', function (req, res) {

     console.log(req);

    if(!req.body.email)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    
     Campaign.find({email:req.body.email}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully pulled the Campaigns ' });
    })

});

/*
Get expiring campaigns by number of days

*/

router.get('/getExpiringCampaigns', function (req, res) {

    res.sendStatus(200);

});

module.exports = router;
