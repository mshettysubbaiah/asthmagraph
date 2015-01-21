// Load requird packages

var mongoose = require('mongoose');

// Define People Schema

var PeopleSchema = new mongoose.Schema({
	name : String, 
	title : String,
	addbyuserId: String
});

// Export the model
// Check this link
// http://stackoverflow.com/questions/18628656/model-find-returns-empty-in-mongoose
var collectionName = 'people';
module.exports = mongoose.model('People', PeopleSchema, collectionName);