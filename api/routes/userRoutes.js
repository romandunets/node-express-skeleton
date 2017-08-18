'use strict';

module.exports = function(app) {
  var userlist = require('../controllers/userController');

  app.route('/users')
    .get(userlist.list_all_users)
    .post(userlist.create_user);

  app.route('/users/:id')
    .get(userlist.read_user)
    .put(userlist.update_user)
    .delete(userlist.delete_user);
};
