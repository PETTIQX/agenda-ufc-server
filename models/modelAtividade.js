var mongoose = require('../db.js');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var constants = {
  MODEL_NAME: 'Atividade',
  COLLECTION_NAME: 'atividades'
}

// #-0 uma vez, 1 Diariamente, 2 Semanalmente, 3 Mensalmente
// campo de exclusão de fim de semana
// date = dia, mes, ano
var schema = new Schema({
  nome: {type:String, required:true},
  descricao: {type:String, required:true},
  categoria: {type:String, required:true},
  horarios: [
    {
          hora: {type: Date, required: true},
          dia: {type:Number, required:true},
          mes: {type: Number, required:true},
          ano: {type:Number, default: 0},
          excluirFds: {type: Boolean, default: true},
          diaDaSemana: {type: Number, required: true},
          frequencia: {type: Number, required:true}
    }
  ],
  local: {type: ObjectId},
  tags: [String],
  site: {type:String},
  imagens: [String],
  usuario: {type:ObjectId, required:true}
}, {collection: constants.COLLECTION_NAME})

schema.statics.addImage = function(idAtividade,image, cb){

  var query = {_id: idAtividade}

  var update = {
    $pushAll: {imagens:image}
  }

  var options = {
    "multi" : false,  // update only one document
    "upsert" : false  // insert a new document, if no existing document match the query
  }

  this.update(query, update, options, cb);
}

schema.statics.removeImage = function(idAtividade, idUsuario, imagem, callback){

  this.update(
    // query
    {
        _id: idAtividade,
        usuario: idUsuario
    },
    // update
    { $pull: { imagens: imagem} },
    // options
    {
        "multi" : false,  // update only one document
        "upsert" : false  // insert a new document, if no existing document match the query
    }
  ).exec(callback);

}

schema.statics.search = function(query, sort, skip, limit, cb){

  if(query._id){
    query._id = mongoose.Types.ObjectId(query._id);
  }
  if(query.usuario){
    query.usuario = mongoose.Types.ObjectId(query.usuario);
  }
  if(query.local){
    query.local = mongoose.Types.ObjectId(query.local);
  }

  var aggregation = [
      {$match: query},
      {$lookup:
         {
           from: "locais",
           localField: "local",
           foreignField: "_id",
           as: "local"
         }
      },
      {$unwind: "$local"}
    ];

  //mongoose.Types.ObjectId
  if(sort){
    aggregation.push({$sort:sort});
  }

  if(skip){
    aggregation.push({$skip:skip});
  }

  if(limit){
    aggregation.push({$limit:limit});
  }

  this.aggregate(aggregation).exec(cb);
}

var Atividade  = mongoose.model(constants.MODEL_NAME, schema)
Atividade.constants = constants

module.exports = Atividade;
