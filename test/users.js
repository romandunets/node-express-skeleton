const mongoose = require('mongoose');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');
var userFixtures = require('./fixtures/users');
var fixtures = require('pow-mongodb-fixtures').connect('mongodb://localhost/node-express-skeleton-test');

describe('Users', () => {

  var adminUser = userFixtures.users.admin;
  var testUser = userFixtures.users.test;
  var token = '';

  beforeEach(function(done) {
    fixtures.clearAllAndLoad(__dirname + '/fixtures', function(err) {
      chai.request(app)
      .post('/authenticate')
      .type('form')
      .send({ email: adminUser.email, password: adminUser.plainPassword })
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
    it('it should get a single user if authorized and has admin rights', (done) => {
      chai.request(app)
        .get('/users/' + testUser._id)
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
    var newUser = {
      email: 'new@mail.com',
      password: 'password'
    };

    it('it should create a new user', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send(newUser)
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
