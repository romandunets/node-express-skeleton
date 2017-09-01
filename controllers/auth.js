'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

var User = mongoose.model('Users');
var configuration = require('../config/config')

var privateKey = configuration.key.privateKey;
var tokenExpireInMinutes = configuration.key.tokenExpireInMinutes;

exports.authenticate = function(req, res) {

  User.findOne({ email: req.body.email })
  .select('+hash_password')
  .exec(function(err, user) {

    if (err) throw err;

    console.log(user);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      bcrypt.compare(req.body.password, user.hash_password, function(err, doesMatch){
        if (doesMatch) {
          var token = jwt.sign(user, privateKey, {
            expiresIn: tokenExpireInMinutes
          });

          res.json({
            success: true,
            message: 'Token created.',
            token: token
          });
        } else {
          res.status(401).json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        }
      });
    }
  });
}

exports.verify_token = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, privateKey, function(err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token.'
        });    
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'No token provided.'
    });
  }
};
