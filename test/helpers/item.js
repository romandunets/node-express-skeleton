var responseHelper = require('./response');

exports.assertItem = function(res, item) {
  responseHelper.assertObject(res, { name: item.name });
}

exports.assertDoesNotContainItemData = function(res, message) {
  responseHelper.assertObject(res, { message: message });
  res.body.should.not.include.keys('name', 'owner');
}
