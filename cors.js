module.exports = function() {
    return function(req, res, next) {
        console.log("CORS enable")
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next()
    }
}