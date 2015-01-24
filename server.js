// Load required packages
var path 		= require('path');
var express 	= require('express');
var mongoose 	= require('mongoose');
var bodyParser 	= require('body-parser');  	// accept data via POST or PUT
var session 	= require('express-session');
var passport 	= require('passport'); 		// Load passport package for authentication
var ejs 		= require('ejs');
var flash    	= require('connect-flash');
var sleep 		= require('sleep');

var config 				= require('./config/config')
var peopleController 	= require('./controllers/people');
var userController 		= require('./controllers/user');
var authController 		= require('./controllers/auth');
var clientController 	= require('./controllers/client');
var oauth2Controller 	= require('./controllers/oauth2');


// Terms controller
var termsController 	= require('./controllers/terms');
var solrSearchController = require('./controllers/solr');

// To be used by the session
var sess;


// Connect to the Mongodb
// mongoose.connect('mongodb://localhost:27017/human');

// Create our Express application
var app = express();

// Use environment defined port or 3000
// var port = process.env.PORT || 3000;
// See bin/www

// Create our Express router
var router = express.Router();

// Begin by setting the token to null
app.set('token', null);

// Set view engine to ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', {layout: false});

// static path
app.use(express.static(path.join(__dirname, 'public')));

// Use the body-parser package in our application
app.use(bodyParser.json());  		// json parser
app.use(bodyParser.urlencoded());	// urlencoded parser

// Use express session support since OAuth2orise requires it
app.use(session({
	secret: 'GRRRRRFICASSTHMA',  // Super Secrete Session Key
	saveUninitialized : true,
	resave: true,
	
	/*cookie: {
		maxAge: 30000
	} */
}))


app.use(flash()); 	// use connect-flash for flash messages stored in session

// Use the passport package in our application
app.use(passport.initialize());

// Middleware
app.use(function(req, res, next) {
    
    console.log('middleware validation');
      
   next();
});





// Initial route to /api
// http://localhost:3000/api
// 
// 
router.get('/', function(req, res){
	res.json({message: 'You are motivating People!'});

});

router.get('/sessionmgmt', function(req, res){

	sess = req.session;
	console.log(sess);

	/*
	* Here we have assign the 'session' to 'sess'.
	* Now we can create any number of session variable we want.
	* Here we do like this.
	*/
	// sess.email;
	// sess.username;
	// sess.token;


	if (sess.email) {
		/*
		* This line checks session existence.
		* If it exists then will do some action
		*/
	
		// res.json({message: 'You are motivating People!'});
		res.redirect('/api/adminsess');
	} else {
		res.render("indexsess");
	}
	
});


router.post('/loginsess', function(req, res){
	sess=req.session;
	//In this we are assigning email to sess.email variable.
	//email comes from HTML page.
	sess.email=req.body.email;
	console.log(sess);
	// res.json({email : sess.email});
	res.end('done');
});

router.get('/adminsess',function(req,res){
	sess=req.session;
	if(sess.email) {

		res.write('<h1>Hello '+sess.email+'</h1>');
		res.end('<a href="/api/logoutsess">Logout</a>');
	} else 	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href="/api/sessionmgmt">Login</a>');
	}
});

router.get('/logoutsess',function(req,res){

	req.session.destroy(function(err){
		if(err) {
		 console.log(err);
		}
		else {
			res.redirect('/api/sessionmgmt');
		}
	});
});





// Create endpoint handlers for /people
router.route('/people')
	.get(authController.isAuthenticated, peopleController.getPeople)
	.post(authController.isAuthenticated, peopleController.postPerson);
	

// Create endpoint handlers for /people/:person_id
router.route('/people/:person_id')
	.get(authController.isAuthenticated, peopleController.getPerson)
	.delete(authController.isAuthenticated, peopleController.deletePerson);

// Create endpoint handlers for /user
router.route('/users')
	.post(userController.postUser)
	.get(authController.isAuthenticated, userController.getUsers);

// Create endpoint handlers for /clients
router.route('/clients')
	.post(authController.isAuthenticated, clientController.postClients)
	.get(authController.isAuthenticated, clientController.getClients);

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
	.get(authController.isAuthenticated, oauth2Controller.authorization)
	.post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
	.post(authController.isClientAuthenticated, oauth2Controller.token);











// ----------------------------------------------------------------------
// Web Application Section 
// ----------------------------------------------------------------------

var webapp = require('./controllers/webapp/webapprouter')(app);
// app.use('/', webapp);



// Account & Accountauth with passport and passport-local-mongoose
var Account = require('./models/account');
var accountAuthController = require('./controllers/accountauth').loginauthendpoints (app, passport);




// Note: createStrategy: Sets up passport-local LocalStrategy with correct options.
//When using usernameField option to specify alternative usernameField e.g. "email"
//passport-local still expects your frontend login form to contain an input with
//name "username" instead of email
//https://github.com/saintedlama/passport-local-mongoose
passport.use(Account.createStrategy());


// Connect to mongodb Accounts DB
mongoose.connect(config.mongo_url);


// Create endpoint handlers for /terms
router.route('/terms')
	.get(termsController.getTerms)
	.post(termsController.postTerm)
	.put(termsController.putTerm);

// Create endpoint handlers for /terms
router.route('/gettermdetails')
	.get(termsController.getTermDetails);

// Create endpoint handlers for /terms
router.route('/getstandardterms')
	.get(solrSearchController.getSolrSearchResultsAsync);


// router.route('/logintest')
// 	.get();

/*
// router.route('/registeruser')
//	.post(accountAuthController.registerUser);

router.route('/validatetoken')
	.get(accountAuthController.validateToken);

*/


// Register the Routes and Start Server
app.use('/api', router);

// Start the Server
// app.listen(port);
// see bin/www

module.exports = app;