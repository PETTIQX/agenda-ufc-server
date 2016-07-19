var express = require('express')
var router = express.Router()
var Atividade = require('../../models/modelAtividade');
var _ = require('lodash');

router.post('/', function(req,res, next){

    if(!req.auth.editor){
      return res.sendStatus(401);
    }

    if(!req.body.atividade){
      return res.sendStatus(400);
    }

    var atividade = new Atividade(req.body.atividade);
    atividade.usuario = req.auth._id;
    //TODO add local if does not exists
    atividade.save(function(err, atividadeSaved){

      if(err){
        return next(err);
      }

      return res.json(atividadeSaved);
    })

});

router.put('/', function(req,res, next){

    if(!req.auth.editor){
      return res.sendStatus(401);
    }

    if(!req.body.atividade){
      return res.sendStatus(400);
    }


    Atividade.findById(req.body.atividade._id, function(err, atividade){

      if(err){
        return next(err);
      }

      if(!atividade){
        return res.sendStatus(204);
      }

      if(req.auth._id != atividade.usuario){
        return res.sendStatus(401);
      }

      atividade = _.extend(atividade, req.body.atividade);

      atividade.save(function(err, atividadeUpdated){
          if(err){
            return next(err);
          }

          return res.json(atividadeUpdated);
      })

    })

});


router.delete('/', function(req,res, next){

    if(!req.auth.editor){
      return res.sendStatus(401);
    }

    if(!req.body.idAtividade){
      return res.sendStatus(400);
    }

    var query = {_id:req.body.idAtividade, usuario:req.auth._id};
    Atividade.findOneAndRemove(query, function(err, response){

      if(err){
        return next(err);
      }

      return res.json(response);
    })

});

router.get('/', function(req,res,next){
  if(!req.auth.editor){
    return res.sendStatus(401);
  }

  var query = {usuario:req.auth._id};
  Atividade.find(query, function(err, atividades){
      if(err){
        return next(err);
      }

      return res.json(atividades);
  });

});

router.post('/busca', function(req,res,next){
  if(!req.auth.editor){
    return res.sendStatus(401);
  }

  var skip = parseInt(req.body.skip || 0)
  var limit = parseInt(req.body.limit || 0)
  var sort = req.body.sort || {data:-1}

  req.body.query.usuario = req.auth._id;

  Atividade.search(req.body.query, sort, skip, limit, function(err, atividades){
    if(err){
      return next(err);
    }

    return res.json(atividades);
  });

});

module.exports = router;
