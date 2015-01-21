// Load required packages
var Client = require('../models/client');

// Create endpoint /api/clients for POST
exports.postClients = function(req, res) {
	// create a new instance of the Client model
	var client = new Client({
		name: req.body.name,
		id: req.body.id,
		secret: req.body.secret,
		userId: req.user._id
	});

	// Savet eh client and check for erros
	client.save(function(err){
		if (err)
			res.send(err);

		res.json({message: 'Client added to the application', data: client});
	});
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
	// Use the Client model to find all clients
	Client.find({userId: req.user._id}, function(err, clients){
		if (err)
			res.send(err);

		res.json(clients);
	});
};