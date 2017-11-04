exports.assertUser = function(res, user) {
  res.should.have.status(200);
  res.type.should.equal('application/json');
  res.body.should.be.a('object');
  res.body.should.contain({ email: user.email, role: user.role });
  res.body.should.not.include.keys('password');
}
