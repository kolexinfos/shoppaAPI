var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.json("Default route for campaigns");

});

router.post('/', function (req, res) {

    res.sendStatus(200);

});

//Get the top trending campaigns on Shoppa
router.get('/getTopCampaigns', function (req, res) {

    res.sendStatus(200);

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
