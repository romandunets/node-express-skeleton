'use strict';

var mongoose = require('mongoose');
var Item = mongoose.model('Item');

exports.list = function(req, res) {
  if (!req.currentUser.canRead(req.locals.user))
    return res.status(403).send({ message: 'You do not have rights to access this resource.' });

  Item.find({ owner: req.params.userId }, function(err, item) {
    if (err) return res.send(err);
    res.json(item);
  });
};

exports.create = function(req, res) {
    var user = req.locals.user;
    if (!req.currentUser.canEdit(user))
      return res.status(403).send({ message: 'You do not have rights to access this resource.' });

    var item = new Item(req.body);
    item.owner = user;
    item.save(function(err, item) {
      if (err) return res.send(err);

      user.items.push(item);
      user.save(function(err, user) {
        if (err) return res.send(err);
        res.json(item);
      });
    });
};

exports.read = function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if (!req.currentUser.canRead(item))
      return res.status(403).send({ message: 'You do not have rights to access this resource.' });
    if (err) return res.send(err);
    res.json(item);
  });
};

exports.update = function(req, res) {
  Item.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, item) {
    if (!req.currentUser.canEdit(item))
      return res.status(403).send({ message: 'You do not have rights to access this resource.' });
    if (err) return res.send(err);
    res.json(item);
  });
};

exports.delete = function(req, res) {
  Item.remove({ _id: req.params.id }, function(err, item) {
    if (!req.currentUser.canEdit(item))
      return res.status(403).send({ message: 'You do not have rights to access this resource.' });
    if (err) return res.send(err);
    res.json({ message: 'Item successfully deleted' });
  });
};
