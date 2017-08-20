const routes = require('express').Router();

const users = require('../controllers/users');
const auth = require('../controllers/auth');

routes.route('/')
  .get(auth.verify_token, users.list_all_users)
  .post(users.create_user);

routes.route('/:id')
  .all(auth.verify_token)
  .get(users.read_user)
  .put(users.update_user)
  .delete(users.delete_user);

module.exports = routes;
