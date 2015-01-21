var express = require('express');
var router = express.Router();

module.exports = function(app) {

	app.get('/index', function(req, res) {
		// show the home page (will also have our login links)
		res.render('index.ejs');
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });

	});

	app.get('/login_new', function(req, res) {
		res.render('login_new.ejs', { message: req.flash('loginMessage') });

	});

	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {message: req.flash('signupMessage') });

	});

	app.get('/tables_black', function(req, res) {
		res.render('tables_black.ejs', {message: req.flash('tableViewMessage') });

	});

	app.get('/tables_white', function(req, res) {
		res.render('tables_white.ejs', {message: req.flash('tableViewMessage') });

	});

	app.get('/graphapp', function(req, res){

		var appsSavedToken = app.get('token');

		if (appsSavedToken) { 
		
			res.render('graphapp', {info: 'Running Graph Application', err:null});

		} else {
			res.redirect('/401');
		}
	})

	app.get('/leftpanel', function(req, res){

		res.render('leftpanel', {info: 'Left panel', err:null});
	})

	app.get('/rightpanel', function(req, res){

		res.render('rightpanel', {info: 'Right panel', err:null});
	})

	app.get('/401', function(req, res){


		res.render('401', {info: 'Right panel', err:null});
	})



	app.get('/appspage', function(req, res) {

		var appsSavedToken = app.get('token');

		if (appsSavedToken) { 
		
			res.render('appspage.ejs', {message: req.flash('signupMessage') });

		} else {
			res.redirect('/401');
		}

	});

	app.get('/logout', function(req, res) {

		res.redirect('/api/logout');

		// res.render('logout.ejs', {message: req.flash('signoutMessage') });
	})

}


// module.exports = router;