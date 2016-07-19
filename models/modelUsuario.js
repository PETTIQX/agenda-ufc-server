var mongoose = require('../db.js');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var constants = {
  MODEL_NAME: 'Usuario',
  COLLECTION_NAME: 'usuarios'
}

//Vinculação # 0 - aluno, 1 - professor - 2 - servidores em geral,
var schema = new Schema({
  nome: {type:String, required:true},
  login:{type:String, required:true, unique:true},
  email: {type:String, required:true},
  telefone: {type:String, required:true},
  senha: {type:String, required:true, select:false},
  vinculacao: {type:Number, required:true},
  editor: {type:Number, default:false}
}, {collection: constants.COLLECTION_NAME})

var fullUser = {nome:1, login:1, email:1, telefone:1, senha:1, vinculacao:1, editor:1};

schema.statics.authenticateUser = function(login, senha, cb){

    var query = {
      login:login
    };

    this.findOne(query,fullUser, function(err, user){

      if(err){
        return cb(err);
      }

      if(!user){
        return cb({message:"usuário inválido"})
      }

      bcrypt.compare(senha, user.senha,function(err, valid){
        if(err) {
          return cb(err);
        }

        if(!valid) {
            return cb({message:"senha inválida"});
        }

        return cb(null, user);

      });

    });
};

var Usuario  = mongoose.model(constants.MODEL_NAME, schema)
Usuario.constants = constants

module.exports = Usuario;
