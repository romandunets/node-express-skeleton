const express = require('express');
const routes  = express.Router();

const users = require('../../controllers/users');
const auth  = require('../../controllers/auth');
const items = require('./items');

routes.use('/:userId/items', items);

routes.route('/:id')
  .all(auth.verify_token)
  .get(users.read)
  .put(users.update)
  .delete(users.delete);

routes.route('/')
  .get(auth.verify_token, users.list)
  .post(users.create);

module.exports = routes;
