// Load the modules and scripts
var config = require('../config/config');
var Account = require('../models/account');
var Token = require('../models/account').Token;

/**
 * [exports description]
 * @param  {[type]} app      [description]
 * @param  {[type]} passport [description]
 * @return {[type]}          [description]
 */
exports.loginauthendpoints = function(app, passport) {
	
	/**
	 * POST for /gettoken
	 * This method will validate the logged in user and creates a new token upon
	 * successful authentication
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	app.post('/api/gettoken', passport.authenticate('local', {session: false}), function(req, res) {

        var login = req.body.login;

        

        if (req.user) {
            Account.createUserToken(req.user.email, function(err, usersToken) {
                // console.log('token generated: ' +usersToken);
                // console.log(err);
                if (err) {
                    res.json({
                    	status: "fail",
                    	error: 'Issue generating token'
                    });
                } else {

                    // Set the value of the token in the app
                    app.set('token', usersToken);

                    // return the token as response
                    res.json({
                    	status: "success",
                		data : {
	                    		message: 'Congratulations, new token created!',
	                    		token : usersToken
                    			}
                    });
                }
            });
        } else {
            res.json({
            	status: "fail",
            	error: 'AuthError'
            });
        }
    });


    /**
     * /api/registeruser
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    app.post('/api/registeruser', function (req, res){

        var name = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var user = new Account({full_name: name, email: email});
        var message;

        Account.register(user, password, function (err, account){
            console.log(err);
            if (err) {
                if (err.name === 'BadRequestError' && err.message && err.message.indexOf('exists') > -1) {
                    res.json({message: 'Sorry. That email already exists. Try again.'});
                } else if (err.name === 'BadRequestError' && error.message && error.message.indexOf('is not set')) {
                    res.json({message: 'It looks like you\'re missing a required argument. Try again.'});
                } else {
                    res.json({message: 'Sorry. There was an error processing your request. Please try again or contact technical support.'});
                }
            } else {

                // User is registered successfully
                // Create the token and assign to that user
                Account.createUserToken(user.email, function(err, usersToken) {
                    // console.log('token generated: ' +usersToken);
                    //console.log(user);
                    if (err) {
                        res.json({error: 'Issue generating token'});
                    } else {

                        // Set the value of the token in the app
                        app.set('token', usersToken);

                        // Return the token as response
                        res.json({
                                status: "success",
                                data : {
                                        message: 'Congratulations, your account was created!',
                                        token : usersToken
                                        }
                                });
                    }
                });

                // res.json({message: 'Congratulations, your account was created!'});
            }
        });
    });

    /**
     * /api/logout
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    app.post('/api/logout', function(req, res) {
        var incomingToken = req.headers.token;
        console.log('LOGOUT: incomingToken: ' + incomingToken);
        if (incomingToken) {
            var decoded = Account.decode(incomingToken);
            if (decoded && decoded.email) {
                Account.invalidateUserToken(decoded.email, function(err, user){
                    if (err) {
                        res.json( {
                                    status: 'fail',
                                    message: 'Issue finding user (in unsuccessful attempt to invalidate token).'

                                    });
                    } else {
                        // when logout set the token to null
                        app.set('token', null);

                        res.json( {
                                    status: 'success',
                                    message: 'logged out'
                        });
                        res.render('login.ejs', {message: req.flash('logoutMessage')});
                    }
                });
            } else {
                res.json ( {
                    status: 'fail',
                    message: 'Issue decoding incoming token.'
                });
            }
        } else {
            res.json ( {
                    status: 'fail',
                    message: 'token was not passed'
                });
        }
    });


    /**
     * GET /api/logout
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    app.get('/api/logout', function(req, res) {

        // get the saved token
        var appsSavedToken = app.get('token');
        console.log('LOGOUT: appsSavedToken: ' + appsSavedToken);
        
        if (appsSavedToken) {
            var decoded = Account.decode(appsSavedToken);
            if (decoded && decoded.email) {
                Account.invalidateUserToken(decoded.email, function(err, user){
                    if (err) {
                        res.json( {
                                    status: 'fail',
                                    message: 'Issue finding user (in unsuccessful attempt to invalidate token).'

                                    });
                    } else {
                        // when logout set the token to null
                        app.set('token', null);

                        /*
                        res.json( {
                                    status: 'success',
                                    message: 'logged out'
                        }); */

                        res.render('login.ejs', {message: req.flash('logoutMessage')});
                    }
                });
            } else {
                res.json ( {
                    status: 'fail',
                    message: 'Issue decoding incoming token.'
                });
            }
        } else {
            res.render('login.ejs', {message: req.flash('logoutMessage')});
        }
    });

    /**
     * /api/validatetoken
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    app.post('/api/validatetoken', function(req, res){
        var incomingToken = req.headers.token;
        var tokenVerification = {};
        verifyToken(incomingToken, req, res);
        // res.json({message: "valid token"});
        return callback(null, true);
    }); 

};

exports.validateAuthTokenInternal = function(token, req, res, callback) {
    
    console.log("------------1");
    var incomingToken = token;
    var tokenVerification = {};
    var status = verifyTokenInternal(incomingToken);
    return callback(status, req, res);

};


/*
var async = require('async')

exports.alertdisplay = function (token, req, res, cb) {
    console.log('Testing');
  async.waterfall([

        async.apply(getToken, token, req, res),
        function(arg1, arg2, arg3, callback){
            console.log(arg1);
            // console.log(arg2);
            // console.log(arg3);
            callback(null, 'one', 'two');
        },
        function(arg1, arg2, callback){
          // arg1 now equals 'one' and arg2 now equals 'two'
            console.log(arg1);
            console.log(arg2);
            callback(null, 'three');
        },
        function(arg1, callback){
            // arg1 now equals 'three'
            console.log(arg1);
            callback(null, 'done');
        }
    ], function (err, result) {
       // result now equals 'done'   
       console.log(result); 
    });
}

function getToken(token, req, res, callback) {
    // console.log(token);
    callback(null, token, req, res);

}
*/




var async = require('async')

exports.alertdisplay = function (token, req, res, cb) {
    console.log('Testing');
  async.waterfall([

        async.apply(getToken, token, req, res),
        function(arg1, arg2, arg3, callback){
            console.log(arg1);
            // console.log(arg2);
            // console.log(arg3);
            callback(null, 'one', 'two');
        },
        function(arg1, arg2, callback){
          // arg1 now equals 'one' and arg2 now equals 'two'
            console.log(arg1);
            console.log(arg2);
            callback(null, 'three');
        },
        function(arg1, callback){
            // arg1 now equals 'three'
            console.log(arg1);
            callback(null, 'done');
        }
    ], function (err, result) {

            // result now equals 'done'  
            // 
            if(err){
                console.error("Controller waterfall Error" , err);
                res.send("Error in serving request.");
            } 
            console.log(result); 
    });
}

function getToken(token, req, res, callback) {
    // console.log(token);
    callback(null, token, req, res);

}


/*
exports.alertdisplay = function (token, req, res, callback) {

  async.waterfall([
        async.apply(getToken, token, req, res),
        function(token, req, res, callback){

            console.log('------ Get Token & Decoding the Token ------ 2');
            var decodedAccountData = Account.decode(token);

            if (decodedAccountData == false) {
                status = false;   // status == false
                console.log("display the status ", +status);
                callback(err, status)
            }
            
            callback(null, decodedAccountData, token);
        },
        function(decodedAccountData, token, callback){
            // arg1 now equals 'three'
            // 
            console.log('------ Finding User ------ 3');
            var status = Account.findUser(decodedAccountData.email, incomingToken, function (err, user){
                if (err) {
                    // Any general errors
                    status = false;
                    console.log('general verify token issues');
                    return status;
                } else {
                    if (Token.hasExpired(user.token.date_created)) {
                        // Token Expired
                        console.log('');
                        console.log('------ Yes, it is expired! ------ 4');
                        status = false;
                        return status;

                    } else {
                        // Success
                        console.log('is it success!');
                        status = true;
                        return status;
                    }
                }
            });
            callback(null, status);
        }
    ], function (err, result) {
       // result now equals 'done'
          
       console.log(result); 

    });
}




/*

module.exports.validateToken = function(token){
    var incomingToken = req.headers.token;
    console.log(incomingToken);
    var tokenVerification = {};
    verifyToken(incomingToken, req, res);
    return callback(null, true);
};
*/





/**
 * [verifyToken description]
 * @param  {[type]} incomingToken [description]
 * @param  {[type]} req           [description]
 * @param  {[type]} res           [description]
 * @return {[type]}               [description]
 */
function verifyToken(incomingToken, req, res) {
	// console.log('incomingToken: ' + incomingToken);

	var returnData = { status: "Testing"};
	var decodedAccountData = Account.decode(incomingToken);

    console.log('inside verifyToken');

	// Now do a lookup on that email (which is username)
	// If it exists then it is a real user
	if (decodedAccountData && decodedAccountData.email) {

		Account.findUser(decodedAccountData.email, incomingToken, function (err, user){
			if (err) {
				returnData["status"] = "fail";
				returnData["error"] = "Issue finding user. Contact administrator";
				res.json(returnData);
			} else {
				if (Token.hasExpired(user.token.date_created)) {
					returnData["status"] = "fail";
					returnData["error"] = "Token has expired. You need to log in again";

				} else {
					returnData["status"] = "success";
					returnData["error"] = "Need to reassign based on the data";
					res.json(returnData);
				}
			}
		});
	} else {
        returnData["status"] = "fail";
		returnData["error"] = 'Issue decoding incoming token.';
		res.json(returnData);
    }
};



/**
 * [verifyToken description]
 * @param  {[type]} incomingToken [description]
 * @param  {[type]} req           [description]
 * @param  {[type]} res           [description]
 * @return {[type]}               [description]
 */
function verifyTokenInternal(incomingToken) {
    // console.log('incomingToken: ' + incomingToken);

    var status;
    console.log('------------2');
    var decodedAccountData = Account.decode(incomingToken);

    if (decodedAccountData == false) {
        status = false;   // status == false
        console.log("display the status ", +status);
        return status;
    }

    getUserStatus(decodedAccountData, incomingToken, function(status){

        console.log('------------4');


        return status;
    })

};


function getUserStatus (decodedAccountData, incomingToken, callback) {

    //var status = false;
    
    console.log('------------3');

    Account.findUser(decodedAccountData.email, incomingToken, function (err, user){
        if (err) {
            // Any general errors
            status = false;
            console.log('general verify token issues');
            return callback(status);
        } else {
            if (Token.hasExpired(user.token.date_created)) {
                // Token Expired
                console.log('is it expired!');
                status = false;
                return callback(status);

            } else {
                // Success
                console.log('is it success!');
                status = true;
                return callback(status);
            }
        }
    });

};



var async = require('async');

exports.asyncSeries = function (req, res, callback) {

    var token = req.headers.token;
    var userData;
    var userTokenData;
    var status;
    var isTokenValid = true;
    async.series([

            // Load to get the decoded user account data
            function(callback) {

                console.log('------ Decode the token ------ 1');
                
                decodedAccountData = Account.decode(token);

                // if true means error 
                if (decodedAccountData == true) {
                    status = "Unable to decode";   // status == false
                    console.log("display the status ", + status);
                    callback(true, status);
                }

                status = "Successfully decoded here";
                callback(false, status);
            },

            // Get the user and check whether the user exists
            function(callback){

                status = '';
                console.log('------ Finding User ------ 2');
                Account.findUser(decodedAccountData.email, token, function (err, user) {
                    if (err) {
                        // Any general errors
                        status = "general verify token issues";
                        console.log('general verify token issues');
                        callback(true, status);
                    }
                    //console.log(user);
                    
                    userTokenData = user;
                    status = "Found User!";
                    callback(false, status);
                });
            },
            // Get the token and ensure it is not expired
            function(callback){

                console.log("------ Finding Token Expiration ------ 3")

                if (Token.hasExpired(userTokenData.token.date_created)) {
                    // Token Expired
                    console.log('------ Yes, it is expired! ------ 4');
                    status = "Token expired! Please login again";
                    return callback(true, status);
                }

                console.log("Successfully logged in"); 

                status = "Successfully logged in";
                return callback(false, status);
            }
        ],

        // Final callback 
        function(err, status) {

            if (err) {
                console.log("----- Error --------");
                console.log(status);
                isTokenValid = false;

                return callback(true, isTokenValid);
            }
            
            callback(false, isTokenValid);
        });

        
    };

//   async.waterfall([
//         async.apply(getToken, token, req, res),
//         function(token, req, res, callback){

//             console.log('------ Get Token & Decoding the Token ------ 2');
//             var decodedAccountData = Account.decode(token);

//             if (decodedAccountData == false) {
//                 status = false;   // status == false
//                 console.log("display the status ", +status);
//                 callback(err, status)
//             }
            
//             callback(null, decodedAccountData, token);
//         },
//         function(decodedAccountData, token, callback){
//             // arg1 now equals 'three'
//             // 
//             console.log('------ Finding User ------ 3');
//             var status = Account.findUser(decodedAccountData.email, incomingToken, function (err, user){
//                 if (err) {
//                     // Any general errors
//                     status = false;
//                     console.log('general verify token issues');
//                     return status;
//                 } else {
//                     if (Token.hasExpired(user.token.date_created)) {
//                         // Token Expired
//                         console.log('');
//                         console.log('------ Yes, it is expired! ------ 4');
//                         status = false;
//                         return status;

//                     } else {
//                         // Success
//                         console.log('is it success!');
//                         status = true;
//                         return status;
//                     }
//                 }
//             });
//             callback(null, status);
//         }
//     ], function (err, result) {
//        // result now equals 'done'
          
//        console.log(result); 

//     });
// }

/*var async = require('async');

exports.asyncSeries = function(req, res, next) {

    var locals = {};
    var name = req.params.name;
    var userId; //Define userId out here, so both tasks can access the variable
    var token = req.headers.token;
    var decodedAccountData;

    async.series([
        //Load user to get userId first
        function(callback) {

            decodedAccountData = Account.decode(token);
            // if true means error 
            if (decodedAccountData == true) {
                status = "Unable to decode";   // status == false
                console.log("display the status ", + status);
                callback(true, status);
            }

            status = "Successfully decoded here";
            callback(false, status);
        },
        function(callback) {

            status = "";

            Account.findUser(decodedAccountData.email, token, function (err, user){
                if (err) {
                    // Any general errors
                    status = "general verify token issues";
                    console.log('general verify token issues');
                    return callback(true, status);
                } else {
                    if (Token.hasExpired(user.token.date_created)) {
                        // Token Expired
                        console.log('------ Yes, it is expired! ------ 3');
                        status = "Token expired! Please login again";
                        return callback(true, status);

                    } else {
                        // Success
                        console.log('is it success!');
                        status = "Successfully logged in";
                        //callback(false, status);
                    }
                }
            });
            callback(true, status);
        },
        //Load posts (won't be called before task 1's "task callback" has been called)
        function(callback) {
            console.log("------------ Final -------------");
            callback(false, "--------- Data -----------");
        }
    ], function(err, data) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) {
            console.log(data);
            return next(err);
        }
        //Here locals will be populated with 'user' and 'posts'
        console.log(data);
    });
}*/


var async1 = require('async');

exports.asyncSeries1 = function (req, res, callback) {

    var sharedData = "Data from : ";
    async1.series([
            // First function
            function(callback) {
                sharedData = "First Callback";
                callback();
            },
            // Second function
            function(callback){
                console.log(sharedData);
                sharedData = "Second Callback";
                callback();
            }
        ],
        // Final callback 
        function(err) {
            console.log(sharedData);
            if (err) {
                callback();
            }
            callback();
        }
    );
};






var async2 = require('async')

exports.asyncWaterfall1 = function (arg1, arg2, cb) {
    async2.waterfall([
        // async.apply
        async2.apply(assignVariables, arg1, arg2),
        // First callback
        function(arg1, arg2, callback){
            console.log(arg1);
            console.log(arg2);
            arg1 = 5;
            arg2 = 6;
            callback(null, arg1, arg2);
        },
        // Second callback
        function(arg1, arg2, callback){
          // arg1 now equals 'one' and arg2 now equals 'two'
            console.log(arg1);
            console.log(arg2);
            arg1 = 7;
            arg2 = 8;
            callback(null, arg1, arg2);
        }
    ], 
    function (err, arg1, arg2) {
        console.log(arg1);
        console.log(arg2);  
    });
};

// Method to assign variables
function assignVariables(arg1, arg2, callback) {
    console.log(arg1);
    console.log(arg2);
    arg1 = 3;
    arg2 = 4;
    callback(null, arg1, arg2);
};




/*
var async = require('async')

exports.alertdisplay = function (token, req, res, cb) {
    console.log('Testing');
  async.waterfall([

        async.apply(getToken, token, req, res),
        function(arg1, arg2, arg3, callback){
            console.log(arg1);
            // console.log(arg2);
            // console.log(arg3);
            callback(null, 'one', 'two');
        },
        function(arg1, arg2, callback){
          // arg1 now equals 'one' and arg2 now equals 'two'
            console.log(arg1);
            console.log(arg2);
            callback(null, 'three');
        },
        function(arg1, callback){
            // arg1 now equals 'three'
            console.log(arg1);
            callback(null, 'done');
        }
    ], function (err, result) {
       // result now equals 'done'   
       console.log(result); 
    });
}

function getToken(token, req, res, callback) {
    // console.log(token);
    callback(null, token, req, res);

}
*/



