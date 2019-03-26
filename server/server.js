require('./config/config');
const path = require('path');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const {mongoose} = require('./db/mongoose'); //must stay
const {User} = require('./models/user');
const {Test} = require('./models/test');
const {authenticate} = require('./middleware/authenticate');
const {whoIsIt} = require('./middleware/whoIsIt');
const {isAdmin} = require('./middleware/isAdmin');

const app = express();
const publicPath = path.join(__dirname, '..', 'client', 'public');
console.log(publicPath);

const port = process.env.PORT;

const corsOptions = {exposedHeaders: 'x-auth'};
app.use(express.static(publicPath));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());



console.log('tohle je NODE_ENV: ', process.env.NODE_ENV);

//==========================================================================





//==================I AM ALIVE============================================
app.get('/api/alive', whoIsIt, (req,res) => {
 

    res.send(req.user);
});







//=================GET ALL TESTS=========================================

app.get('/api/get-all', whoIsIt, (req, res) => {
    
    //retrieve all tests with only custom notes belonging to logged user:
    //aggregate is more complex than find, altering data sent to client
    //$addFields adds new field (property) to queried test, if field added already exist, it will be overwritten
    //here to filter custom notes to only those of logged user, customNote array si overwritten with only one array element belonging to logged user
    Test.aggregate([
        {
            $addFields: {
                customNotes: {
                    $filter: {
                        input: '$customNotes',
                        as: 'item',
                        cond: {$eq: ['$$item.department', req.user.nick]}
                    }
                }
            }
        }
    ]).then((allTestsFromDB) => {
        //each object in test array is stripped of lab info if user is of department type or not logged in
        let filteredTests = allTestsFromDB.map((item) => {
            if (req.user.rights === 'department' || !req.user.rights) {
                //_.omit removes selected properties from object
                return _.omit(item, ['parcelWho', 'parcelPreanal', 'parcelNote']);
            } else {
                return item;
            }
           
        });
        res.send(filteredTests);
    });

    

    // Test.find({}).then((allTests) => {
    //     console.log(JSON.stringify(allTests, undefined, 2));

    //     //===============================================================================================================================
    //     // PRIDAT VLASTNOST RIGHT K FRONTENDU PRI SIGNUPU A PAK FILTROVAT VRACENE TESTY PODLE TOHO JESTLI ODDELENI NEBO LABINA
    //     //===============================================================================================================================

    //     //.map iterates through array of tests, on each test object an array of custom notes is filtered and only notes corresponding to user are returned back to each test object
    //     filteredTests = allTests.map((item) => {
            
    //         //each object in customNotes array is checked if it belongs to logged user
    //         filteredCustomNotes = item.customNotes.filter((noteItem) => 
    //             noteItem.department === req.user.nick
    //         );

    //         //whole array of custom notes is overwritten by filtered one for each test in test array
    //         item.customNotes = filteredCustomNotes;

    //         //test with filtered custom notes is returned to new array
    //         return item;
    //     });

        
    //     res.send(filteredTests);
    // });

});


// ========== ADD TEST=============================================================

app.post('/api/addtest', isAdmin, (req, res) => {
   
    // console.log('pridani testu pred spustenim save');
     
    let test = new Test(req.body);         //creates new mongoose model
    test.save().then((savedTest) => {
        // console.log(savedTest);
        res.send(savedTest);
    }).catch((e) => {res.status(400).send(e);});
});



//========================= DELETE TEST ===================================================

app.delete('/api/tests/:id', isAdmin, (req, res) => {
    let id = req.params.id;

    Test.findByIdAndRemove(id).then((removedTest) => {
        res.send(removedTest);
    });


});




app.patch('/api/tests/:id', isAdmin, (req, res) => {
    let id = req.params.id;
    // let updates = _.pick(req.body, ['name', 'where']);

    Test.findByIdAndUpdate(id, {$set: req.body}, {new: true}).then((updatedTest) => {
        if (!updatedTest) {
            return res.status(404).send();
        }
        res.send(updatedTest);
    }).catch((e) => {
        res.status(400).send(e);
    });
});










// =================ADD CUSTOM NOTE ========================================

app.post('/api/customNote/:id', authenticate, whoIsIt, (req, res) => {
   


    //finds test by id in params, goes through array of customNotes and checks if there is any custom note from particular user (user is checked by whoIsIt middleware),
    // if yes, it is overwritten, if not, it is pushed as new array item

    Test.findById(req.params.id).then((foundTest) => {
        if (foundTest) {
            
            //check if user has customNote, user is appended to req as user.nick by whoIsIt middleware
            let index = foundTest.customNotes.findIndex((item) => {
                return item.department === req.user.nick;
            });

            //if user does not have custom note (index === -1) then add that note to custom notes array
            if (index === -1) {
                foundTest.customNotes.push({department: req.user.nick, customNote: req.body.customNote});
            // if he does then update value of that array element
            } else {
                foundTest.customNotes[index] = {department: req.user.nick, customNote: req.body.customNote};
            }

            
            foundTest.save().then((updatedLabMet) => {
                
                // filteredCustomNotes gets new array with only 1 item -> custom note from logged user, other custom notes are filtered (only if department property of custom note object equals nick of logged user)
                const filteredCustomNotes = updatedLabMet.customNotes.filter((item) => {
                    return item.department === req.user.nick;
                });
                // new object customNoteAndId get properties of _id of just updated lab met and customNotes of filtered custom notes with only those of logged user
                //this gets send back to user
                let customNoteAndId = {_id: updatedLabMet._id, customNotes: filteredCustomNotes};
                res.send(customNoteAndId);
            });                    
        }
    });
});





//==============EDIT TEST============================================================================================
app.patch('/api/tests/:id', isAdmin, (req, res) => {
    let id = req.params.id;
    // let updates = _.pick(req.body, ['name', 'where']);

    Test.findByIdAndUpdate(id, {$set: req.body}, {new: true}).then((updatedTest) => {
        if (!updatedTest) {
            return res.status(404).send();
        }
        res.send(updatedTest);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


// ============ SIGN UP=================================

// THIS VERSION SIGNS UP USER AND LOGIN HIM (CREATES AND SENDS TOKEN) IMMEDIATELY
// app.post('/api/adduser', (req, res) => {
//     //only users with admin rights can create new users
//     // if (req.user.rights === 'admin') {
//     if(2 > 1) {
//         let extractedProps = _.pick(req.body, ['nick', 'password', 'rights']);
//         let user = new User(extractedProps);
    
//         user.save().then((savedUser) => {
//             return user.generateAuthToken();
//         }).then((retreivedToken) => {
//             res.cookie('x-auth', retreivedToken).send(user);
//             //res.header('x-auth', retreivedToken).send(user);
//         }).catch((e) => {
//             res.status(400).send(e);
//         });
//     } else {
//         res.send('nemas opravneni vytvaret uzivatele');
//     }
    
// });

//THIS VERSION ONLY CREATES NEW USER AND SAVES HIM TO DB
// app.post('/api/adduser', isAdmin, (req, res) => {
app.post('/api/adduser', (req, res) => { //for admin creation
    console.log('chci admina a mam ho');
    
    //only users with admin rights can create new users
    // if (req.user.rights === 'admin') {
    // if(2 > 1) {
    let extractedProps = _.pick(req.body, ['nick', 'password', 'rights']);
    let user = new User(extractedProps);

    user.save().then(() => {
        res.send(user);
        //res.header('x-auth', retreivedToken).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
    // } else {
    //     res.status(400).send('nemas opravneni vytvaret uzivatele');
    // }
    
});


//=============== LOGIN=============================================
app.post('/api/login', (req, res) => {
    let extractedProps = _.pick(req.body, ['nick', 'password', 'rights']);

    User.findByCredentials(extractedProps.nick, extractedProps.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            // console.log('token', token);
            // res.header('x-auth', token).send(user);
            res.cookie('x-auth', token).send(user);
        }).catch((e) => {
            res.status(400).send(e);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});



//===========================WHOISLOGGED======================================

app.get('/api/me', whoIsIt, (req, res) => {

    // console.log('whoisloggedje: ',req.user);
    
    res.send({user: req.user});
   
});




//=================== LOGOUT
//req.user.removeToken and req.token are accessible cause of authenticate middleware which appends them to req object
app.delete('/api/logout', authenticate, (req, res) => {
    // console.log('pokus o smazani');
    // console.log(req.token);
    
    // res.send('ahoj');
    req.user.removeToken(req.token).then(() => {
        console.log('povedla se fce removeToken');
        
        
        res.status(200).clearCookie('x-auth').send('uspesne odhlasen')
        //res.status(200).send('uspesne odhlasen')
    }).catch((e) => {
        console.log('pokus o smazani na severu se nepovedl');
        
        res.status(400).send(e);
    });
});


// ========================================= CLIENT RENDERING =========================

app.get ('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});











app.listen(port, () => {
    // console.log(`Started up at port ${port}`);
    console.log('server started');
});

module.exports = {app};




