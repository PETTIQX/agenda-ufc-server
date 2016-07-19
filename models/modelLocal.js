var mongoose = require('../db.js');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var constants = {
  MODEL_NAME: 'Local',
  COLLECTION_NAME: 'locais'
}

var schema = new Schema({
  nome: {type:String, required:true, unique:true},
  descricao: {type:String, required:true}
}, {collection: constants.COLLECTION_NAME})


var Local  = mongoose.model(constants.MODEL_NAME, schema)
Local.constants = constants

module.exports = Local;
