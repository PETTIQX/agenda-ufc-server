var express = require('express');
var router = express.Router();
var Atividade = require('../../models/modelAtividade');

router.post('/busca', function(req,res,next){

  var skip = parseInt(req.body.skip || 0);
  var limit = parseInt(req.body.limit || 0);
  var sort = req.body.sort || {nome:-1};

  Atividade.search(req.body.query, sort, skip, limit, function(err, atividades){
    if(err){
      return next(err);
    }

    return res.json(atividades);
  });

});

router.post('/buscaAvancada', function(req,res,next){

  var skip = parseInt(req.body.skip || 0);
  var limit = parseInt(req.body.limit || 0);
  var sort = req.body.sort || {nome:-1};

  console.log(req.body.query);

  Atividade.periodSearch(req.body.query, sort, skip, limit, function(err, atividades){
    if(err){
      return next(err);
    }

    return res.json(atividades);
  });

})

module.exports = router;
