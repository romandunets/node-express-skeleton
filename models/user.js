'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  items : [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }]
});

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

UserSchema.methods.getTokenData = function() {
  return {
    id: this.id,
    email: this.email
  }
};

UserSchema.methods.verifyPassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
