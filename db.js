//using  Immediately Invoked Function Expression (IIFE)

(function(){
    var mongoose = require('mongoose')
    mongoose.set('debug', true);

    mongoose.connect('mongodb://localhost/ufc-agenda', function () {
        console.log('mongodb connected')
    })
    module.exports = mongoose
})()
