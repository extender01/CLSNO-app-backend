const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
console.log('mongo URI: ', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, (e) => {
    console.log('mongoose pripojeni...')
    console.log('mongoose connect: ', e);
    
});

module.exports = {mongoose};