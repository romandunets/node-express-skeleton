'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var response = require('../helpers/response');
var User = mongoose.model('User');
var config = require('config')

var privateKey = config.key.privateKey;
var tokenExpireInMinutes = config.key.tokenExpireInMinutes;

exports.authenticate = function(req, res) {
  User.findOne({ email: req.body.email })
  .exec(function(err, user) {
    if (err) throw err;

    if (!user) {
      response.sendUnauthorized(res, 'Authentication failed.');
    } else if (user) {
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          var token = jwt.sign(user.getTokenData(), privateKey, {
            expiresIn: tokenExpireInMinutes
          });

          res.json({
            success: true,
            message: 'Token created.',
            token: token
          });
        } else {
          response.sendUnauthorized(res, 'Authentication failed.');
        }
      });
    }
  });
}

exports.verifyToken = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, privateKey, function(err, decoded) {
      if (err) {
        response.sendUnauthorized(res, 'Failed to authenticate token.');
      } else {
        User.findById(decoded.id, function(err, user) {
          if (err) res.send(err);
          req.currentUser = user;
          next();
        });
      }
    });
  } else {
    response.sendUnauthorized(res, 'No token provided.');
  }
};
