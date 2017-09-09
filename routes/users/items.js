const express = require('express');
const routes  = express.Router({ mergeParams: true });

const items = require('../../controllers/items');
const auth  = require('../../controllers/auth');

var mongoose = require('mongoose');
var User = mongoose.model('User');

routes.use(auth.verify_token);

routes.use(function (req, res, next) {
  User.findById(req.params.userId, function (err, user) {
    if (err) res.send(err);
    req.locals = { user: user };
    next();
  });
});

routes.route('/')
  .get(items.list)
  .post(items.create);

routes.route('/:id')
  .get(items.read)
  .put(items.update)
  .delete(items.delete);

module.exports = routes;
