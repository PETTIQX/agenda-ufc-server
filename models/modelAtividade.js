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
