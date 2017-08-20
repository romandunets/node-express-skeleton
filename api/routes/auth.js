const routes = require('express').Router();
const auth = require('../controllers/auth');

routes.route('/authenticate')
  .post(auth.authenticate);

routes.use(auth.verify_token);

module.exports = routes;
