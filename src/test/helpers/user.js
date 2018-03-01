import responseHelper from './response';

exports.assertUser = function(res, user) {
  responseHelper.assertObject(res, { email: user.email, role: user.role });
  res.body.should.not.include.keys('password');
}

exports.assertCreatedUser = function(res, user) {
  responseHelper.assertCreated(res, { email: user.email, role: user.role });
  res.body.should.not.include.keys('password');
}

exports.assertDoesNotContainUserData = function(res, message) {
  responseHelper.assertObject(res, { message: message });
  res.body.should.not.include.keys('email', 'items', 'role', 'password');
}
