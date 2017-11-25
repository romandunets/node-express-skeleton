var responseHelper = require('./response');

exports.assertUser = function(res, user) {
	// TODO: status should be 201
  responseHelper.assertObject(res, { email: user.email, role: user.role });
  res.body.should.not.include.keys('password');
}

exports.assertDoesNotContainUserData = function(res, message) {
  responseHelper.assertObject(res, { message: message });
  res.body.should.not.include.keys('email', 'items', 'role', 'password');
}
