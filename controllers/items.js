'use strict';

var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var User = mongoose.model('User');

exports.list = function(req, res) {
  Item.find({}, function(err, item) {
    if (err)
      res.send(err);
    res.json(item);
  });
};

exports.create = function(req, res) {
  User.findById(req.params.userId, function(err, user) {
    if (err) res.send(err);

    var new_item = new Item(req.body);
    new_item.owner = user;
    new_item.save(function(err, item) {
      if (err) res.send(err);
      res.json(item);
    });
  });
};

exports.read = function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if (err)
      res.send(err);
    res.json(item);
  });
};

exports.update = function(req, res) {
  Item.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, item) {
    if (err)
      res.send(err);
    res.json(item);
  });
};

exports.delete = function(req, res) {
  Item.remove({
    _id: req.params.id
  }, function(err, item) {
    if (err)
      res.send(err);
    res.json({ message: 'Item successfully deleted' });
  });
};
