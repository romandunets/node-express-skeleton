const express = require('express');
const routes  = express.Router();

const auth  = require('./auth');
const users = require('./users');

var response = require('../helpers/response');

routes.use('/', auth);
routes.use('/users', users);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});

routes.use(function(req, res) {
  response.sendNotFound(res);
});

module.exports = routes;
