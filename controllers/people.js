
// Load application packages or Models
var People = require('../models/people');

// Create end points for /api/people for GET
exports.getPeople = function(req, res){
	
	People.find({}, function(err, people){
		if (err)
			res.send(err);

		res.json({message: 'Found people!', data: people});
	});
};

// Create end points for /api/people/:person_id for GET
exports.getPerson = function(req, res){

	var id = req.params.person_id;
	
	People.findById(id, function(err, person){
		if (err)
			res.send(err);

		res.json({message: 'Found person!', data: person});
	});
};

// Create end points for /api/people/:person_id for POST
// Will insert person info into the database
exports.postPerson = function(req, res){

	var person = new People({
		name: req.body.name,
		title: req.body.title,
		addbyuserId: req.user._id
	});
	
	person.save(function(err){
		if (err)
			res.send(err);

		res.json({message: 'New person added successfully', data: person});
	});
};

// Create endpoint for /api/people/:person_id for DELETE
exports.deletePerson = function(req, res){

	console.log(req.params.person_id);
	console.log(req.user._id);

	// Use the Person model to find a specific person and remove it
	People.remove({addbyuserId: req.user._id, _id:req.params.person_id}, function(err){
		if (err)
			res.send(err);

		res.json({message: 'Person removed successfully'});
	});

};