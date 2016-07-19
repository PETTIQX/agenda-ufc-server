var express = require('express');
var router = express.Router();

router.use('/usuario', require('./usuario'));
router.use('/atividade', require('./atividade'));
router.use('/local', require('./local'));

module.exports = router;
