const routes = require('express').Router();
const auth = require('../controllers/auth');

routes.route('/authenticate')
  .post(auth.authenticate);

module.exports = routes;
