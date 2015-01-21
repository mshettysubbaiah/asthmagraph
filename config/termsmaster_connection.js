// connect with termsmaster db

var mongoose = require('mongoose'),
	mongoURI = 'mongodb://localhost:27017/termsmaster';

module.exports = termsmasterConnection = mongoose.createConnection(mongoURI);

termsmasterConnection.on('connected', function() {
	console.log('Mongoose connected to termsmaster db');
});

// Provide the datamodel
require('../models/terms');