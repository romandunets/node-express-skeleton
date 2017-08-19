'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = mongoose.model('Users');

exports.authenticate = function(req, res) {

  // find user by email
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    // respond with error if user was not found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        // respond with error if password does not match
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right, create a token
        var token = jwt.sign(user, 'password', { // TODO: to settings
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Token created.',
          token: token
        });
      }  
    }
  });
}

exports.verify_token = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'password', function(err, decoded) { // TODO: to settings  
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
};
