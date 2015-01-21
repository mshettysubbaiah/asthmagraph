/**
 * This module performs the DAO functionalities
 * Adds term data
 * Delete term data
 * Update term data
 */

// Load application packages or Models

// get the connector
var termsmasterConnection = require('../config/termsmaster_connection'); 
var Terms 			= termsmasterConnection.model('Terms');
var tokenvalidator 	= require('./accountauth');


// Create end points for /api/terms for GET
exports.getTerms = function(req, res){

	var request = req;
	var response = res;

	var somevariable = tokenvalidator.asyncWaterfall1(1, 2, function(err, isTokenValid){

		console.log("Testing");
		
	});

/*
	var somevariable = tokenvalidator.asyncSeries(req, res, function(err, isTokenValid){

		console.log("Token is valid: ", + isTokenValid);

		if (isTokenValid == true) {

			Terms.find({}, function(err, terms) {
				console.log('found data');
				console.log(terms);
				
				if (err)
					res.send(err);

				res.json({message: 'Found terms!', data: terms});
			});
		} else {
			res.json({message: 'No data found, error occured. Check log file'});
		}
		
	});
*/
};

// Create end points for /api/terms/:term_id for GET
exports.getTerm = function(req, res){

	var id = req.params.term_id;
	
	Terms.findById(id, function(err, term){
		if (err)
			res.send(err);

		res.json({message: 'Found term!', data: term});
	});
};

// Create end points for /api/terms/:term_id for POST
// Will insert term info into the database
exports.postTerm = function(req, res){

	var term = new Terms(req.body.termdata);
	
	term.save(function(err){
		if (err)
			res.send(err);

		res.json({message: 'New term added successfully', data: term});
	});
};

// Create endpoint for /api/terms/:term_id for DELETE
exports.deleteTerm = function(req, res){

	console.log(req.params.term_id);
	console.log(req.user._id);

	// Use the Person model to find a specific term and remove it
	Terms.remove({addbyuserId: req.user._id, _id:req.params.term_id}, function(err){
		if (err)
			res.send(err);

		res.json({message: 'Person removed successfully'});
	});

};