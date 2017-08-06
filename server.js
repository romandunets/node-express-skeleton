var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var Task = require('./api/models/wordlistModel');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/wordlistdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/wordlistRoutes');
routes(app);

app.listen(port);

console.log('Wordlist REST API server started on port: ' + port);
