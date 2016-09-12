var express = require('express')
var router = express.Router()
var Atividade = require('../../models/modelAtividade');
var _ = require('lodash');
var fs = require('fs');
var multiparty = require('connect-multiparty');
var path = require('path');
var util = require('../../util');


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
  var sort = req.body.sort || {nome:-1}

  req.body.query.usuario = req.auth._id;

  Atividade.search(req.body.query, sort, skip, limit, function(err, atividades){
    if(err){
      return next(err);
    }

    return res.json(atividades);
  });

});

router.delete('/image', function(req,res,next){

  if(!req.auth.editor){
    return res.sendStatus(401);
  }

  if(!req.body.idAtividade || !req.body.imagem){
      return res.sendStatus(400);
  }

  var idUsuario = req.auth._id;

  Atividade.removeImage(req.body.idAtividade, idUsuario, req.body.imagem, function(err, result){
    if(err){
      return next(err);
    }

    return res.json(result);
  });

});

router.route('/image')
    .post(multiparty(), function(req,res,next){
        //TODO atributo "principal" para foto de capa
        //TODO atributo "imagemPrincipal" para a imagem da atividade
        if(!req.auth.editor){
          return res.sendStatus(401);
        }

        if(!req.body.idAtividade){
            return res.sendStatus(400);
        }

        Atividade.findById(req.body.idAtividade, function(err, atividade){

            if(!atividade){
                console.log("Atividade nulo")
                return res.sendStatus(400);
            }

            //Verificar Permissão
            if(req.auth._id != atividade.usuario){
              return res.sendStatus(401);
            }

            res.setHeader("Access-Control-Allow-Origin", "*");

            if(!req.files) return res.sendStatus(400);
            if(!req.files.file) return res.sendStatus(400);

            var arquivo = req.files.file;
            var temporario = req.files.file.path;

            //var novo = __dirname + "/uploads/" + util.generateUUID() + ".png"
            console.log(temporario.indexOf(".jpg") > -1);
            var ext = (temporario.indexOf(".jpg") > -1) ? ".jpg" : ".png";

            var imagePathName = util.generateImageName(ext);

            var novo = util.generateFullImagePath(imagePathName);

            fs.rename(temporario, novo, function(err){
                if(err) {
                    //return res.sendStatus(500).json({error: err})
                    return next(err);
                }

                Atividade.addImage(req.body.idAtividade, [imagePathName], function(err, atividade){

                    if(err){
                        //return res.sendStatus(500).json({error: err})
                        return next(err);
                    }

                    return res.sendStatus(200);
                })

            })

        })

    })

module.exports = router;
