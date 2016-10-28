var express = require('express');
var router = express.Router();
var Campaign = require('../models/campaign');
var moment = require('moment');
var _ = require('lodash');



/* GET campaigns default get route page. */
router.get('/', function (req, res) {

    Campaign.find({}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        else{
        res.status(201).json({ success: true,result:result, message: 'Successfully pulled the Campaigns ' });
        }
    })

});

router.post('/', function (req, res) {
    console.log(req.body);

    if(!req.body.name || !req.body.type || !req.body.description || !req.body.enabled || !req.body.expiring
        || !req.body.image || !req.body.tags )
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


/*
 Like Campaign

 */
router.post('/likeCampaign', function(req,res){
    console.log(req.body);

    if(!req.body.email || !req.body.campaignid)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else{
    console.log( moment.utc().format('YYYY-MM-DD HH:mm:ss'));
    Campaign.findOneAndUpdate({_id:req.body.campaignid}, { $push: { likes : {"email" : req.body.email, "timestamp" : moment.utc().format('YYYY-MM-DD HH:mm:ss') } } }, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to update campaign ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully added users to the list of user likes for this campaign ' });
    })
    }
});

router.post('/shareCampaign', function(req,res){
    console.log(req.body);

    if(!req.body.email || !req.body.campaignid)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else{

    Campaign.findOneAndUpdate({_id:req.body.campaignid}, { $push: { share : {"email" : req.body.email, "timestamp" : moment.utc().format('YYYY-MM-DD HH:mm:ss') } } }, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to update the share for this campaign ' + err});
        }
        else{
        res.status(201).json({ success: true,result:result, message: 'Successfully added users to the list of user share for this campaign ' });
        }
    })
    }

});

router.post('/wantinCampaign', function(req,res){
    console.log(req.body);

    if(!req.body.email || !req.body.campaignid)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else{
    Campaign.findOneAndUpdate({_id:req.body.campaignid}, { $push: { wantin : {"email" : req.body.email, "timestamp" : moment.utc().format('YYYY-MM-DD HH:mm:ss') } } }, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to update the share for this campaign ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully added users to the list of wantin for this campaign ' });
    })
    }

});


//Update Campaign details
router.put('/', function(req, res){
    console.log(req.body);

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
        else{

        res.status(200).json({ success: true,result:result, message: 'Successfully created Campaign ' + req.body.name });
        }
    })

});

/*
Get campaigns that would displayed on user timeline
*/
router.post('/getUserCampaigns', function (req, res) {

    console.log(req.body);

    if(!req.body.email)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else
    {
   //Get all campaigns that user has not liked or opted in to
            Campaign.find({}, function (err, result) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: 'An error occurred on trying to pull the campaigns ' + err
                    });
                }

                //Remove campaigns already liked by user
                result = _.reject(result, {likes: [{email: req.body.email}] });

                //Remove Campaigns already followed by user
                result = _.reject(result, {wantin: [{email: req.body.email}] });

                console.log(result.length);
                res.status(200).json({success: true, result: result, message: 'Successfully pulled the Campaigns '});
            }).limit(20);
        }
        });

/*
Get Campaigns liked by User
*/
router.post('/userCampaignLikes', function (req, res) {

     console.log(req.body);

    if(!req.body.email)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    
     Campaign.find({}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }
        result = _.filter(result, {likes: [{email: req.body.email}] });
        res.status(200).json({ success: true,result:result, message: 'Successfully pulled the Campaigns ' });
    })

});

/*
Get expiring campaigns by number of days

*/

router.get('/getExpiringCampaigns', function (req, res) {

    res.sendStatus(200);

});



module.exports = router;
