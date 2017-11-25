exports.assertObject = function(res, object) {
  res.should.have.status(200);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.contain(object);
}

exports.assertCreated = function(res, object) {
  res.should.have.status(201);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.contain(object);
}

exports.assertBadRequest = function(err, res) {
  res.should.have.status(400);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.contain({'success': false});
  res.body.should.include.keys('success', 'message');
}

exports.assertNotAuthorized = function(err, res) {
  res.should.have.status(401);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.to.deep.equal({'success': false, 'message': 'No token provided.'});
}

exports.assertForbidden = function(err, res) {
  res.should.have.status(403);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.contain({'success': false, 'message': 'You do not have rights to access this resource.'});
}

exports.assertNotFound = function(err, res) {
  res.should.have.status(404);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.contain({'success': false, 'message': 'Resource not found.'});
}
