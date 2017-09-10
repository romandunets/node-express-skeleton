'use strict';

var mongoose = require('mongoose');
var Item = mongoose.model('Item');

exports.list = function(req, res) {
  // TODO: return 401 if requested for another user
  if (req.current_user.id != req.params.userId)
    return res.status(403).json({ message: 'You do not have rights to access list items of this user.' });
  Item.find({ owner: req.params.userId }, function(err, item) {
    if (err) res.send(err);
    res.json(item);
  });
};

exports.create = function(req, res) {
    var user = req.locals.user;
    var item = new Item(req.body);

    item.owner = user;
    item.save(function(err, item) {
      if (err) res.send(err);

      user.items.push(item);
      user.save(function(err, user) {
        if (err) res.send(err);
        res.json(item);
      });
    });
};

exports.read = function(req, res) {
  // TODO: return 401 if requested item owned by another user
  Item.findById(req.params.id, function(err, item) {
    if (err) res.send(err);
    res.json(item);
  });
};

exports.update = function(req, res) {
  // TODO: return 401 if requested item owned by another user
  Item.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, item) {
    if (err) res.send(err);
    res.json(item);
  });
};

exports.delete = function(req, res) {
  // TODO: return 401 if requested item owned by another user
  Item.remove({ _id: req.params.id }, function(err, item) {
    if (err) res.send(err);
    res.json({ message: 'Item successfully deleted' });
  });
};
