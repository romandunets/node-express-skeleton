'use strict';

var mongoose = require('mongoose');
var response = require('../helpers/response');
var User = mongoose.model('User');

exports.list = function(req, res) {
  if (req.currentUser.role != "admin") return response.sendForbidden(res);
  User.find({}, function(err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.read = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return response.sendNotFound(res);
    if (!req.currentUser.canRead(user)) return response.sendForbidden(res);
    res.json(user);
  });
};

exports.create = function(req, res) {
  var new_user = new User(req.body);
  new_user.role = 'user';
  new_user.save(function(err, user) {
    if (err) return response.sendBadRequest(res, err);
    res.json(user);
  });
};

exports.update = function(req, res) {
  var user = req.body;
  delete user.role;
  if (!req.currentUser.canEdit({ _id: req.params.id })) return response.sendForbidden(res);
  User.findOneAndUpdate({ _id: req.params.id }, user, { new: true, runValidators: true }, function(err, user) {
    if (err) return response.sendBadRequest(res, err);
    res.json(user);
  });
};

exports.delete = function(req, res) {
  User.remove({ _id: req.params.id }, function(err, user) {
    if (err) return res.send(err);
    if (!req.currentUser.canEdit(user)) return response.sendForbidden(res);
    res.json({ message: 'User successfully deleted' });
  });
};

exports.load_user = function (req, res, next) {
  User.findById(req.params.userId, function (err, user) {
    if (err) return res.send(err);
    if (!req.locals) req.locals = {};
    req.locals.user = user;
    next();
  });
};
