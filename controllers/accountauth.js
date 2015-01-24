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
        var email = req.user.email;

        // console.log(req.session);

        var sess = req.session;

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
                    // app.set('token', usersToken);
                    sess.email = email;
                    sess.token = usersToken;

                    // console.log(sess);

                    // return the token as response
                    res.json({
                    	status: "success",
                		data : {
	                    		message: 'Congratulations, new token created!',
                                email: email,
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

        var sess = req.session;
        var sessionToken = sess.token;

        console.log('LOGOUT: sessionToken: ' + sessionToken);
        if (sessionToken) {
            var decoded = Account.decode(sessionToken);
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
        // var appsSavedToken = app.get('token');

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



var async = require('async');
/**
 * asyncSeries:
 * It decodes the token, finds the user through email and verifies
 * token expiration. If the token is not expired it responds without 
 * error
 * @param  {[type]}   req      [description]
 * @param  {[type]}   res      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.asyncSeries = function (req, res, callback) {

    //var token = req.headers.token;

    var sess = req.session;

    token = sess.token;

    if (!token) {
        var token = req.query.token;
    }

    console.log(token);
    var userData;
    var userTokenData = token;
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


