const express = require('express');
const routes  = express.Router();

const items = require('../controllers/items');
const auth  = require('../controllers/auth');

routes.use(auth.verify_token);

routes.route('/')
  .get(items.list)
  .post(items.create);

routes.route('/:id')
  .get(items.read)
  .put(items.update)
  .delete(items.delete);

module.exports = routes;
