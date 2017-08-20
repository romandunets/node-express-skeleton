const routes = require('express').Router();
const items = require('../controllers/items');

routes.route('/')
  .get(items.list_all_items)
  .post(items.create_item);

routes.route('/:id')
  .get(items.read_item)
  .put(items.update_item)
  .delete(items.delete_item);

module.exports = routes;
