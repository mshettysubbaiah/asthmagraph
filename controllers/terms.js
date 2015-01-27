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

	tokenvalidator.asyncSeries(req, res, function(err, isTokenValid){

		console.log("Token is valid: ", + isTokenValid);

		if (isTokenValid == true) {

			Terms.find({}, {"term": 1, _id:0}, function(err, terms) {
				// console.log('found data');
				// console.log(terms);
				
				if (err)
					res.send(err);

				var termsResults = [];

				for (var i=0; i < terms.length; i++) {
					// console.log(terms[i].term);
					termsResults.push(terms[i].term);
				}
				// console.log(termsResults);

				res.json({data: termsResults});
			});
		} else {
			res.json({errorcode: 1, message: 'Token invalid, please login', data: ""});
        }
	});
};

// Create end points for /api/terms/:term_name for GET
exports.getTermDetails = function(req, res){

	var term_name = req.query.term_name;
	console.log(term_name);


	Terms.find({term: term_name, active: true})
	 	.sort({date: -1})
	 	.exec(function (err, termDetails) {
	 		if (err) {
	 			res.send(err);
	 		}

	 		res.json({errcode: 0, message: "Found terms!", data: termDetails});
	 });
	
};

// Create end points for /api/terms/:term_id for POST
// Will insert term info into the database
exports.postTerm = function(req, res){

	
	console.log(req.body.term);
	console.log(req.body.concepts);
	console.log(req.body.synonyms);

	tokenvalidator.asyncSeries(req, res, function(err, isTokenValid){

		console.log("Token is valid: ", + isTokenValid);

		if (isTokenValid == true) {

			var term = new Terms();
			term.concepts = req.body.concepts;
			term.term = req.body.term;
			term.synonyms = req.body.synonyms;

			console.log(term);
	
			term.save(function(err){
				if (err)
					res.send(err);

				res.json({message: 'New term added successfully', data: term, status : "true"});
			});

		} else {
			res.json({errorcode: 1, message: 'Token invalid, please login', data: ""});
        
		}
	});
};

// Create end points for /api/terms/:term_id for PUT
// Will insert term info into the database
exports.putTerm = function(req, res){

	
	console.log(req.body.term);
	console.log(req.body.concepts);
	console.log(req.body.synonyms);

	tokenvalidator.asyncSeries(req, res, function(err, isTokenValid){

		console.log("Token is valid: ", + isTokenValid);

		if (isTokenValid == true) {

			var term = new Terms();

			term.concepts = req.body.concepts;
			term.term = req.body.term;
			term.synonyms = req.body.synonyms;
			term.active = true;

			Terms.findOneAndUpdate( 
				{term: term.term},   // find this term
				{$set: {active: false}},
				{sort: {date: -1}},
				function(err, data) {

					console.log(data);

					if (err) {
						res.json({errcode: 1, message: 'The term does not exists. Please use the Term Enter form to enter new data'});
					} else {

						term.save(function(err){
							if (err)
								res.send(err);

							res.json({errcode: 0, message: 'Old term updated successfully, New term added successfully'});
						});
					}
				});


		} else {
			res.json({errorcode: 1, message: 'Token invalid, please login', data: ""});
        }
	});
};

// Create endpoint for /api/terms/:term_id for DELETE
exports.deleteTerm = function(req, res){

	// console.log(req.params.term_id);
	// console.log(req.user._id);

	console.log(req.body.term);

	var term = new Terms();

	term.term = req.body.term;
	term.concepts = req.body.concepts;
	term.synonyms = req.body.synonyms;
	term.active = true;



	Terms.findOneAndUpdate( 
		{term: term.term},   // find this term
		{$set: {active: false}},
		{
			sort: {date: -1},
			upsert: false	// set to false so the data is not created
		},
		function(err, data) {

			// console.log(data);

			if (err) {

				res.json({errcode: 1, message: 'The term does not exists. Please use the Term Enter form to enter new data'});

			} else {
				
				res.json({errcode: 0, message: 'Old term updated successfully. Please use the Term Enter form to enter new data', data: data});

			}
		});

/*

	// Use the Person model to find a specific term and remove it
	Terms.remove({addbyuserId: req.user._id, _id:req.params.term_id}, function(err){
		if (err)
			res.send(err);

		res.json({message: 'Person removed successfully'});
	});*/

};