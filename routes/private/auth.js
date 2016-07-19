var jwt = require('jwt-simple')
var config = require('../../config')

module.exports = function(req,res,next){
    if(req.headers[config.authHeader]){
        try{
            req.auth = jwt.decode(req.headers[config.authHeader], config.secretKey)

            console.log(req.auth);
        }catch(err){
            console.log(err)
            req.unauthorized = true
        }
    }else{
        req.unauthorized = true
    }

    if(req.unauthorized){
        res.status(401)
        return res.json(401)
    }

    next()
}
