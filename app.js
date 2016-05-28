var express = require('express')
var logger = require('morgan')
var router = require('./routes')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

var app = express()

cors = require('./cors');
app.use(cors());

// Configuration
app.use(bodyParser.json())

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use('/api', router)

if('development' == app.get('env')){
  //development only
  //var errorHandler = require('errorhandler');
  //app.use(errorHandler({ dumpExceptions: true, showStack: true }))
  app.use(logger('dev'))
}

if('production' ==  app.get('env')){
  //app.use()
  app.use(logger('common'))
  //todo usar middleware para tratar erros
}

app.use(function(err, req, res, next) {

  console.error(err.stack)

  res.status(500)

  return res.json({code:500,err:err})

});

var server = app.listen(3000 , function(){
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});

module.exports = app;