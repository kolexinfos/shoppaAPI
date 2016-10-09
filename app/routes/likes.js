var express = require('express');
var router = express.Router();
var Campaign = require('../models/campaign');
var Like = require('../models/like');


/* GET default like route page. */
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





module.exports = router;