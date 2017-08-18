// call required packages
var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan     = require('morgan');
var jwt        = require('jsonwebtoken');

// define the application
var app = express();

// load models
var Word = require('./api/models/wordlistModel');
var User = require('./api/models/userModel');

// configure application to use bodyParser which allows to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure application to use morgan for requests logging
app.use(morgan('dev'));

// configure secret variable
app.set('secret', 'supersecret');

// connect to mongo database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/wordlistdb');

// register routes
var routes = require('./api/routes');
app.use('/', routes);

// add handling for 404 - not found
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// set up the port
var port = process.env.PORT || 3000;

// start the server
app.listen(port);

console.log('Wordlist REST API server started on port: ' + port);
