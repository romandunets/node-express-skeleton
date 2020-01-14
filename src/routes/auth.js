const express = require('express')

const auth = require('../controllers/auth')

const routes = express.Router();

routes.route('/authenticate')
  .post(auth.authenticate);

module.exports = routes;
