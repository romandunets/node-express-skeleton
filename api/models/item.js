'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: {
    type: String,
    Required: 'name is required'
  }
});

module.exports = mongoose.model('Items', ItemSchema);
