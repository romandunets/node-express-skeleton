/**
 * Node + Express REST API skeleton application
 * 
 * Install dependencies:
 * npm install
 * 
 * Run the application:
 * npm start
 * 
 * Installing an unscoped package:
 * npm install <package_name>
 */

// Import the modules
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

const User = require('./models/user');
const Item = require('./models/item');

const config = require('./config/dev');
const db = require('./db/db');
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', routes);

const port = process.env.PORT || config.server.port;
app.listen(port);
console.log('Node + REST API skeleton server started on port: ' + port);

module.exports = app;