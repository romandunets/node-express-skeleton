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
        var token = jwt.sign(user, app.get('secret'), {
          expiresInMinutes: 1440 // expires in 24 hours
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
