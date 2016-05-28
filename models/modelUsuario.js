var mongoose = require('../db.js')
var Schema = mongoose.Schema
ObjectId = Schema.ObjectId

var constants = {
  MODEL_NAME: 'Usuario',
  COLLECTION_NAME: 'usuarios'
}

//Vinculação # 0 - aluno, 1 - professor - 2 - servidores em geral,
var schema = new Schema({
  nome: {type:String, required:true},
  login:{type:String, required:true},
  email: {type:String, required:true},
  telefone: {type:String, required:true},
  senha: {type:String, required:true},
  vinculacao: {type:Number, required:true}
  editor: {type:Number, default:false}
}, {collection: constants.COLLECTION_NAME})

var Usuario  = mongoose.model(constants.MODEL_NAME, schema)
Usuario.constants = constants

module.exports = Usuario;