var mongoose = require('mongoose'),
	_ = require('underscore')._,
	Schema = mongoose.Schema,
	config = require('../config/config'),
	passportLocalMongoose = require('passport-local-mongoose'),
	bcrypt = require('crypto'),
	jwt = require('jwt-simple'),
	tokenSecret = 'Put-Kad-Ence-$eCr-HATE-He4e';

// Token Schema
var AccountTokenSchema = new Schema({
	token: { type: String, required: true },
  	// userId: { type: String, required: true },
  	date_created: {type: Date, default: Date.now}
});

AccountTokenSchema.statics.hasExpired = function(created) {
	var now = new Date();
	var diff = (now.getTime() - created);
	return diff > config.ttl;					// check config/config.js
};

var TokenModel = mongoose.model('Accounttoken', AccountTokenSchema);

// Account Schema
var AccountSchema = new Schema({
	// Add other fields as appropriate
	email: {type: String, required: true, lowercase:true, index: { unique: true }},
	full_name: {type: String, required: true},
	date_created: {type: Date, default: Date.now},
	token: {type: Object},
	// For reset we use a reset token with an expiry (which must be checked)
	reset_token: {type: String},
	rest_token_expires_millis: {type: Number}
});
AccountSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

// Wondering where the password field and the salf field
// assport-Local Mongoose will add a username, hash and salt 
// field to store the username, the hashed password and the salt value.
// On line 36 we assigned usernameField to be email

AccountSchema.statics.encode = function (data) {
	return jwt.encode(data, tokenSecret);
};

AccountSchema.statics.decode = function (data) {
	try {
		return jwt.decode(data, tokenSecret);
		}
	catch(err) {
		console.log(err);
	    return true;
	}
};

// Find user by email id and check whether token matches
AccountSchema.statics.findUser = function(email, token, cb) {
	var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
        } else if (usr.token && usr.token.token && token === usr.token.token) {
            cb(false, {email: usr.email, token: usr.token, date_created: usr.date_created, full_name: usr.full_name});
        } else {
            cb(new Error('Token does not exist or does not match.'), null);
        }
    });
};


// Find user by email id and check whether token matches
AccountSchema.statics.findUserWithoutcb = function(email) {
	var self = this;
	console.log(email);
    var usrData = this.findOne({email: email}, function(err, usr) {
    	console.log(usr);
		return usr;
    });

    return usrData;

};



// Find user by email id only
AccountSchema.statics.findUserByEmailOnly = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
        } else {
            cb(false, usr);
        }
    });
};

AccountSchema.statics.createUserToken = function(email, cb) {
	var self = this;
	this.findOne({email: email}, function(err, usr) {
		if (err || ! usr) {
			console.log('err');
		}

		// Create a token and add to user and save
		var token = self.encode({email: email});
		usr.token = new TokenModel({token: token});
		usr.save(function(err, usr){
			if (err) {
                cb(err, null);
            } else {
                console.log("about to cb with usr.token.token: " + usr.token.token);
                cb(false, usr.token.token);//token object, in turn, has a token property :)
            }
		});
	});
};

AccountSchema.statics.invalidateUserToken = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            console.log('err');
        }
        usr.token = null;
        usr.save(function(err, usr) {
            if (err) {
                cb(err, null);
            } else {
                cb(false, 'removed');
            }
        });
    });
};

AccountSchema.statics.generateResetToken = function (email, cb){
	console.log("in generateResetToken...");
	this.findUserByEmailOnly(email, function(err, usr) {
		if (err) {
			cb(err, null);
		} else if (usr) {
			// Generate reset token and URL Link; also, create expiry for reset token
			usr.reset_token = require('crypto').randomBytes(32).toString('hex');
			var now = new Date();
			var expires = new Date(now.getTime() + (config.resetTokenExpiresMinutes * 60 * 1000)).getTime();
			usr.reset_token_expires_millis = expires;
			usr.save();
			cb(false, usr);
		} else {
			cb(new Error('No user with that email found'), null);
		}
	});
};

module.exports = mongoose.model('Account', AccountSchema);
module.exports.Token = TokenModel;