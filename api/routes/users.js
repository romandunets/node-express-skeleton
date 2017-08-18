const routes = require('express').Router();
const users = require('../controllers/userController');

routes.route('/')
    .get(users.list_all_users)
    .post(users.create_user);

routes.route('/:id')
    .get(users.read_user)
    .put(users.update_user)
    .delete(users.delete_user);

module.exports = routes;
