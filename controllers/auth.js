//Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

var BearerStrategy = require('passport-http-bearer').Strategy;
var Client = require('../models/client');
var Token = require('../models/token');



// What we are doing here is setting up passport to use the Basic authentication 
// stategy provided by the passport-http package. For our BasicStrategy, we are 
// defining a callback that will attempt to look up the user using the provided 
// username and if found see if the password is correct. If all works well, it 
// will call the callback method and provide the found user.
passport.use(new BasicStrategy(
	function(username, password, callback){

		console.log(username);
		console.log(password);

		User.findOne({username: username}, function (err, user){

			if (err) { return callback(err); }

			// No user found with that username
			if (!user) { return callback(null, false); }

			// Make sure the password is correct
			user.verifyPassword(password, function(err, isMatch){
				// console.log(password);
				// console.log(user);
				if (err) { return callback(err); }

				// Password did not match
				if (!isMatch) { return callback(null, false); }

				// Success
				console.log('Matched');
				return callback(null, user);
			});
		});
	}));


passport.use('client-basic', new BasicStrategy(
	function(username, password, callback){

		console.log('client-basic passport verification');
		console.log('client-basic passport verification: ' + username);
		console.log('client-basic passport verification: pwd : ', + password);

		Client.findOne({id: username}, function(err, client){
			if (err) {

				return callback(err);
			}

			// No client found with that id or bad password
			if (!client || client.secret !== password) {

				return callback(null, false);

			}

			// Success
			return callback(null, client);
		});
	}));

passport.use('bearer', new BearerStrategy(

	function(accessToken, callback){
		console.log(accessToken);
		// Find the Token
		Token.findOne({value: accessToken}, function(err, token){
			if (err) { return callback(err); }

			// No token found
			if (!token) { return callback(null, false); }

			User.findOne({ _id: token.userId }, function(err, user){
				if (err) { return callback(err); }

				// No user found
				if (!user) { return callback(null, false); }

				// Simple example with no scope
				callback(null, user, { scope: '*'});
			});
		});
		
	}));


// The final piece of this is exporting the isAuthenticated function which tells 
// passport to authenticate using our BasicStrategy. The option of session being 
// set to false tells passport to not store session variables between calls to 
// our API. This forces the user to submit the username and password on each call.
exports.isAuthenticated = passport.authenticate(['basic'], {session : false});


// Client authentication
exports.isClientAuthenticated = passport.authenticate('client-basic', { session: false });


// Bearer Strategy
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false});

// The last piece is to update our server.js file to include the passport package, 
// initialize it with our express app, and call the isAuthenticated function for 
// each call to our API. Open up server.js and update it as follows.