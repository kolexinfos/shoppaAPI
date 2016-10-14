var express = require('express');
var router = express.Router();
var Campaign = require('../models/campaign');
var Like = require('../models/like');


/* GET default like route */
router.get('/', function (req, res) {
    console.log(req);

    Like.find({}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully pulled the likes ' });
    })

});

/* Create a like record */
router.post('/', function (req, res) {
    console.log(req);


    if(!req.body.email || !req.body._id)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }
    else
    {
        const like = new Like({
            userEmail: req.body.email,
            campaignId: req.body._id
        });

        console.log('Saving Campaign :  ' + req.body.name);

        like.save(function(err){
            if(err)
            {
                console.log(err);
                return res.status(400).json({ success: false, message: 'An error occurred on trying to save campaign, please try again later ' + err});
            }

            Campaign.findOneAndUpdate({_id:req.body._id},{ $push: { "likes" : req.body.email } }, function(err, result){
                if(err)
                {
                    console.log(err);
                    return res.status(400).json({ success: false, message: 'An error occurred on trying to search for this campaign ' + err});
                }
                else
                {

                }
            });
            res.status(201).json({ success: true, message: 'Successfully logged the like record for ' + req.body.email + ' for campaign ' + req.body._id });
        })
    }

});

/* Userlikes. */
router.post('/userLikes', function (req, res) {
    console.log(req);
    if(!req.body.email)
    {
        res.status(400).json({ success: false, message: 'Please make sure you pass all the required parameter for this endpoint.' });
        console.log('Missing Parameter');
    }

    Like.find({userEmail:req.body.email}, function(err,result){
        if(err)
        {
            console.log(err);
            return res.status(400).json({ success: false, message: 'An error occurred on trying to pull the campaigns ' + err});
        }

        res.status(201).json({ success: true,result:result, message: 'Successfully pulled the likes ' });
    })

});



module.exports = router;