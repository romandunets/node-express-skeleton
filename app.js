const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const morgan     = require('morgan');
const jwt        = require('jsonwebtoken');

const User = require('./models/user');
const Item = require('./models/item');

const config = require('./config/config');
const db = require('./db/db');
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', routes);

var port = process.env.PORT || config.server.port;
app.listen(port);

console.log('Node + Express REST API skeleton server started on port: ' + port);
