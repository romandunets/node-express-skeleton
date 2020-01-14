const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('../config/dev')
const response = require('../helpers/response')

const User = mongoose.model('User');

const privateKey = config.key.privateKey;
const tokenExpireInMinutes = config.key.tokenExpireInMinutes;

exports.authenticate = function(req, res) {
  User.findOne({ email: req.body.email })
  .exec(function(err, user) {
    if (err) throw err;

    if (user) {
      user.verifyPassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          const token = jwt.sign(user.getTokenData(), privateKey, {
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
    } else {
      response.sendUnauthorized(res, 'Authentication failed.');
    }
  });
}

exports.verifyToken = function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  //console.log("token", token);

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
