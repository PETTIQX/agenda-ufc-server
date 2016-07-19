var express = require('express');
var router = express.Router();
var auth = require('./auth');

router.use('/usuario', auth , require('./usuario'));

module.exports = router;
