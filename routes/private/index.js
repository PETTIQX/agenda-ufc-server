var express = require('express');
var router = express.Router();
var auth = require('./auth');

router.use('/usuario', auth , require('./usuario'));
router.use('/atividade', auth , require('./atividade'));
router.use('/local', auth , require('./local'));

module.exports = router;
