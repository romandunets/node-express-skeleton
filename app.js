// call required packages
var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var morgan     = require('morgan');
var jwt        = require('jsonwebtoken');

// define the application
var app = express();

// load models
var User = require('./models/user');
var Item = require('./models/item');

// configure application to use bodyParser which allows to parse POST request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure application to use morgan for requests logging
app.use(morgan('dev'));

// configure secret variable
//app.set('secret', 'supersecret');

// connect to mongo database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/wordlistdb', { useMongoClient: true });

// register routes
var routes = require('./routes');
app.use('/', routes);

// add handling for 404 - not found
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

// set up the port
var port = process.env.PORT || 3000;

// start the server
app.listen(port);

console.log('Node + Express REST API skeleton server started on port: ' + port);
