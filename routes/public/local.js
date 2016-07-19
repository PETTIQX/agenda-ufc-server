var express = require('express');
var router = express.Router();
var Local = require('../../models/modelLocal');

router.post('/busca', function(req,res,next){

  var skip = parseInt(req.body.skip || 0)
  var limit = parseInt(req.body.limit || 0)
  var sort = req.body.sort || {data:-1}

  Local.find(req.body.query).sort(sort).skip(skip).limit(limit).exec(function(err, locais){
    if(err){
      return next(err);
    }

    return res.json(locais);
  });

});


module.exports = router;
