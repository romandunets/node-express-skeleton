const express = require('express');
const routes  = express.Router();

const users = require('../controllers/users');
const auth  = require('../controllers/auth');

routes.route('/')
  .get(auth.verify_token, users.list)
  .post(users.create);

routes.route('/:id')
  .all(auth.verify_token)
  .get(users.read)
  .put(users.update)
  .delete(users.delete);

module.exports = routes;
