'use strict';

var mongoose = require('mongoose');
var response = require('../helpers/response');
var Item = mongoose.model('Item');

exports.list = function(req, res) {
  if (!req.currentUser.canRead(req.locals.user)) return response.sendForbidden(res);

  Item.find({ owner: req.params.userId }, function(err, item) {
    if (err) return response.sendNotFound(res);
    res.json(item);
  });
};

exports.create = function(req, res) {
    var user = req.locals.user;
    if (!req.currentUser.canEdit(user)) return response.sendForbidden(res);

    var item = new Item(req.body);
    item.owner = user;
    item.save(function(err, item) {
      if (err) return response.sendBadRequest(res, err);

      user.items.push(item);
      user.save(function(err, user) {
        if (err) return response.sendBadRequest(res, err);
        res.json(item);
      });
    });
};

exports.read = function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if (err) return response.sendNotFound(res);
    if (!req.currentUser.canRead(item)) return response.sendForbidden(res);
    res.json(item);
  });
};

exports.update = function(req, res) {
  Item.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, item) {
    if (err) return response.sendBadRequest(res, err);
    if (!req.currentUser.canEdit(item)) return response.sendForbidden(res);
    res.json(item);
  });
};

exports.delete = function(req, res) {
  Item.remove({ _id: req.params.id }, function(err, item) {
    if (err) return response.sendNotFound(res);
    if (!req.currentUser.canEdit(item)) return response.sendForbidden(res);
    res.json({ message: 'Item successfully deleted' });
  });
};
