'use strict';

var mongoose = require('mongoose');
var Word = mongoose.model('Words');

exports.list_all_words = function(req, res) {
  Word.find({}, function(err, word) {
    if (err)
      res.send(err);
    res.json(word);
  });
};

exports.create_word = function(req, res) {
  var new_word = new Word(req.body);
  new_word.save(function(err, word) {
    if (err)
      res.send(err);
    res.json(word);
  });
};

exports.read_word = function(req, res) {
  Word.findById(req.params.id, function(err, word) {
    if (err)
      res.send(err);
    res.json(word);
  });
};

exports.update_word = function(req, res) {
  Word.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, word) {
    if (err)
      res.send(err);
    res.json(word);
  });
};

exports.delete_word = function(req, res) {
  Word.remove({
    _id: req.params.id
  }, function(err, word) {
    if (err)
      res.send(err);
    res.json({ message: 'Word successfully deleted' });
  });
};
