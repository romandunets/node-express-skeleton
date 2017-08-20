const express = require('express');
const routes  = express.Router();

const auth = require('../controllers/auth');

routes.route('/authenticate')
  .post(auth.authenticate);

module.exports = routes;
