var express = require('express');
var router = express.Router();
var Local = require('../../models/modelLocal');
var _ = require('lodash');

router.post('/', function(req,res, next){

    if(!req.auth.editor){
      return res.sendStatus(401);
    }

    if(!req.body.local){
      return res.sendStatus(400);
    }

    var local = new Local(req.body.local);

    local.save(function(err, localSaved){

      if(err){
        return next(err);
      }

      return res.json(localSaved);
    })

});

router.put('/', function(req,res, next){

    if(!req.auth.editor){
      return res.sendStatus(401);
    }

    if(!req.body.local){
      return res.sendStatus(400);
    }


    Local.findById(req.body.local._id, function(err, local){

      if(err){
        return next(err);
      }

      if(!local){
        return res.sendStatus(204);
      }

      local = _.extend(local, req.body.local);

      local.save(function(err, localUpdated){
          if(err){
            return next(err);
          }

          return res.json(localUpdated);
      })

    })

});

router.delete('/', function(req, res, next){

    if(!req.auth.editor){
      return res.sendStatus(401);
    }

    if(!req.body.idLocal){
      return res.sendStatus(400);
    }

    var query = {_id:req.body.idLocal};
    Local.findOneAndRemove(query, function(err, response){

      if(err){
        return next(err);
      }

      return res.json(response);
    })

});

module.exports = router
