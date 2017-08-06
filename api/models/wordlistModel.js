'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WordSchema = new Schema({
  name: {
    type: String,
    Required: 'Kindly enter the name of the word'
  }
});

module.exports = mongoose.model('Words', WordSchema);
