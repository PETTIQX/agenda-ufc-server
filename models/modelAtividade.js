var mongoose = require('../db.js');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var constants = {
  MODEL_NAME: 'Atividade',
  COLLECTION_NAME: 'atividades'
}

// #-1 uma vez, 0 Diariamente, 1 Semanalmente,2 quinzenalmente, 3 Mensalmente
var schema = new Schema({
  nome: {type:String, required:true},
  descricao: {type:String, required:true},
  categoria: {type:String, required:true},
  horarios: [
    {
          data: {type:Date, required:true},
          frequencia: {type: Number, required:true}
    }
  ],
  local: {type: ObjectId},
  tags: [String],
  site: {type:String},
  imagens: [String],
  usuario: {type:ObjectId, required:true}
}, {collection: constants.COLLECTION_NAME})


var Atividade  = mongoose.model(constants.MODEL_NAME, schema)
Atividade.constants = constants

module.exports = Atividade;
