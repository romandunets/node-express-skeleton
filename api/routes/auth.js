const routes = require('express').Router();
const auth = require('../controllers/authController');

routes.route('/authenticate')
  .post(auth.authenticate);

module.exports = routes;
