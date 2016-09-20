//using  Immediately Invoked Function Expression (IIFE)

(function(){
    var mongoose = require('mongoose')
    mongoose.set('debug', true);

    mongoose.connect('mongodb://ec2-52-38-136-232.us-west-2.compute.amazonaws.com/ufc-agenda', function () {
        console.log('mongodb connected')
    })
    module.exports = mongoose
})()
