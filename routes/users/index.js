const express = require('express');
const routes  = express.Router();

const users = require('../../controllers/users');
const auth  = require('../../controllers/auth');
const items = require('./items');

routes.use('/:userId/items', users.loadUser, items);

routes.route('/:id')
  .all(auth.verifyToken)
  .get(users.read)
  .put(users.update)
  .delete(users.delete);

routes.route('/')
  .get(auth.verifyToken, users.list)
  .post(users.create);

module.exports = routes;
