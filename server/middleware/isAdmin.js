let {User} = require('../models/user');



//findByToken checks if token is valid and finds and returns that user as promise resolved value
//then checks if user was found in db and if so, append retreived data to req object to be used in app routing
let isAdmin = (req, res, next) => {
    console.log('prichazi cookies: ', req.cookies);
    let token = req.cookies['x-auth'];
    // console.log('cookies jsou:', req.cookies);
    console.log('spusten isAdminMW');
    console.log('v authenticate je token:', token);
    
    
    User.findByToken(token).then((matchedUser) => {
        if (!matchedUser) {
            console.log('nenasel jsem usera');
            return Promise.reject();
        } 

        if (matchedUser.rights === 'admin') {
            console.log('nasel jsem usera a je admin admin');

            req.user = matchedUser;
            req.token = token;
            next();
        } else {
            console.log('nasel jsem usera ale neni admin');
            return Promise.reject();

        }
        

        
    }).catch((e) => {
       console.log('je to uplne na hovno');
        res.status(401).send(e);
    });
};

module.exports = {isAdmin};
