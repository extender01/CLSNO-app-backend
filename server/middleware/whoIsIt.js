let {User} = require('../models/user');

//finds out who is logged in and appends nick and _id to request object for further use
//check if x-auth cookie comes with request:
    //if not user is directly set to nobody
    //if x-auth token is not found in db (if !found user) or is invalid (.catch), then nobody is returned
    //if everything is fine users nick and _id is appended to request object



// MISTO req.user = {nick: 'nobody', _id: ''}; DAT req = {...req, nick: nobody, _id: ''} ABY TAM NEBYL ZBYTECNY NEST, PODLE TOHO UPRAVIT V USERACTIONS

let whoIsIt = (req, res, next) => {
    let token;
    // console.log('req.cookies je: ', req.cookies);
    if (req.cookies['x-auth']) {
        token = req.cookies['x-auth'];
        // console.log('token je: ', token);

        User.findByToken(token).then((foundUser) => {
           
            if (!foundUser) {
                req.user = {nick: 'nobody', _id: ''};
            } else {
                
    
                req.user = foundUser;
                req.token = token;
                // console.log('foundUser v db je:', foundUser);
                
                // console.log('req po mw je: ', req.user);
                
            }
           
            next();
        }).catch((e) => {
            req.user = {nick: 'nobody', _id: '', rights: 'department'};
            next();
        });


    } else {
        req.user = {nick: 'nobody', _id: '', rights: 'department'};
        next();   
    }  
};






module.exports = {whoIsIt};