var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.json("Default route for companies with campaigns");

});

router.post('/', function (req, res) {

    res.sendStatus(200);

});

module.exports = router;
