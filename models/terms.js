// Load requird packages

var mongoose = require('mongoose'),
	termsmasterConnection = require('../config/termsmaster_connection');

// Define Terms Schema
// DB: termsmaster
// collection: terms

var TermsSchema = new mongoose.Schema({
	concepts : Array, 
	synonyms : Array,
	term: String,
	date: { type: Date, default: Date.now },
	active: Boolean,
	author: String
});

// Export the model
// Check this link
// http://stackoverflow.com/questions/18628656/model-find-returns-empty-in-mongoose
var collectionName = 'terms';
module.exports = termsmasterConnection.model('Terms', TermsSchema, collectionName);