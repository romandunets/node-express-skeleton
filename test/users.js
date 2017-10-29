const mongoose = require('mongoose');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');
var fixtures = require('pow-mongodb-fixtures').connect('mongodb://localhost/node-express-skeleton-test');

describe('Users', () => {

  var token = '';

  beforeEach(function(done) {
    fixtures.clearAllAndLoad(__dirname + '/fixtures', function(err) {
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
  });

  describe('/GET users', () => {
    it('it should list all users if authorized', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(3);
          res.body[0].should.include.keys(
            'email', 'items', 'role'
          );
        done();
      });
    });
  });

  describe('/GET users/:id', () => {
    it('it should get a single user if authorized', (done) => {
      chai.request(app)
        .get('/users/59b50d102d9f6b4110ec9a67')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'email', 'items', 'role'
          );
        done();
      });
    });
  });

  describe('/POST users', () => {
    it('it should create a new user', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send({ email: 'new@mail.com', password: 'password' }) // TODO: move
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'email', 'items', 'role'
          );
        done();
      });
    });
  });

});
