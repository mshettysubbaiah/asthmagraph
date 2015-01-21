// Load required packages
var User = require('../models/user');

// Create endpoint /api/user for POST
exports.postUser = function(req, res){
	var user = new User({
		username: req.body.username,
		password: req.body.password
	});

	user.save(function(err){
		if (err)
			res.send(err);

		res.json({message: 'New user added successfully'});
	});
};

// Create endpoint /api/user for GET
exports.getUsers = function(req, res) {
	User.find(function(err, users){
		if (err)
			res.send(err);

		res.json(users);
	})
};

