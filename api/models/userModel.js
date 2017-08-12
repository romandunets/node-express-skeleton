'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    Required: 'Email is required'
  },
  password: {
  	type: String,
  	Required: 'Password is required'
  }
});

module.exports = mongoose.model('Users', UserSchema);
