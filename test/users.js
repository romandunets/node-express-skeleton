const mongoose = require('mongoose');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');

describe('Users', () => {

  var token = '';

  before(function(done) {
    chai.request(app)
      .post('/authenticate')
      .type('form')
      .send({ email: 'admin@mail.com', password: 'password' }) // TODO: move
      .end(function(err, res) {
        var result = JSON.parse(res.text);
        token = result.token;
        done();
      });
  });

  describe('/GET users', () => {
    it('it should GET all users if authorized', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(3)
        done();
      });
    });
  });

});
