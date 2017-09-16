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

UserSchema.methods.equals = function(user) {
  return this.id == user.id && this.email == user.email;
};

UserSchema.methods.canRead = function(object) {
  return this.equals(object) || (object.owner && object.owner == this.id);
};

UserSchema.methods.canEdit = function(object) {
  return this.canRead(object); // can be extended later
};

module.exports = mongoose.model('User', UserSchema);
