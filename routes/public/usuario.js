var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple')
var config = require('../../config');
var Usuario = require('../../models/modelUsuario');

router.post('/', function(req,res,next){

    if(!req.body.usuario){
      return res.sendStatus(400);
    }

    var usuario = new Usuario(req.body.usuario);

    bcrypt.hash(usuario.senha, config.saltRoundsBCrypt, function(err, hash) {
      if(err){
        return next(err);
      }

      usuario.senha = hash;

      usuario.save(function(err, usuarioSaved){

        if(err){
          return next(err);
        }

        usuarioSaved.senha = "******";

        return res.json(usuarioSaved);
      });
    });

});

router.post('/login', function(req,res,next){

    if(!req.body.usuario || !req.body.usuario.senha || !req.body.usuario.login){
      return res.sendStatus(400);
    }

    Usuario.authenticateUser(req.body.usuario.login, req.body.usuario.senha, function(err, usuario){

        if(err){
          return next(err);
        }

        var payload = {
            login : usuario.login,
            _id : usuario._id,
            editor: usuario.editor,
            vinculacao: usuario.vinculacao};

        var secretKey = config.secretKey;

        var token = jwt.encode(payload, secretKey)

        return res.json({token:token});
    });

});

module.exports = router
