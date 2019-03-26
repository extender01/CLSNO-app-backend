let {User} = require('../models/user');



//findByToken checks if token is valid and finds and returns that user as promise resolved value
//then checks if user was found in db and if so, append retreived data to req object to be used in app routing
let isAdmin = (req, res, next) => {
    let token = req.cookies['x-auth'];
    console.log('cookies jsou:', req.cookies);
    
    // console.log('v authenticate je token:', token);
    
    
    User.findByToken(token).then((matchedUser) => {
        if (!matchedUser) {
            
            return Promise.reject();
        } 

        if (matchedUser.rights === 'admin') {
            req.user = matchedUser;
            req.token = token;
            next();
        } else {
            return Promise.reject();
        }
        

        
    }).catch((e) => {
       
        res.status(401).send(e);
    });
};

module.exports = {isAdmin};
