import express from 'express';

import auth from '../controllers/auth';

const routes = express.Router();

routes.route('/authenticate')
  .post(auth.authenticate);

module.exports = routes;
