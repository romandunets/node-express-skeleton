exports.assertNotAuthorized = function(err, res) {
    res.should.have.status(401);
    res.type.should.equal('application/json');
    res.body.should.be.a('object');
    res.body.should.to.deep.equal({'success': false, 'message': 'No token provided.'});
}
