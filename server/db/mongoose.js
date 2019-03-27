const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
console.log('mongo URI: ', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, (e) => {
    if(e===null) {
        console.log('<|==|> MongoDB je připojeno')
    } else {
        console.log('<|==|> Probém připojení k mongoDB', e)
    }
    
});

module.exports = {mongoose};