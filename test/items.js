const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');
var responseHelper = require('./helpers/response');
var userFixtures = require('./fixtures/users');
var fixtures = require('pow-mongodb-fixtures').connect('mongodb://localhost/node-express-skeleton-test');

describe('Items', () => {

  var adminUser = userFixtures.users.admin;
  var testUser = userFixtures.users.test;
  var adminUserToken = '';
  var testUserToken = '';

  before(function(done) {
    fixtures.clearAllAndLoad(__dirname + '/fixtures', function(err) {
      chai.request(app)
        .post('/authenticate')
        .type('form')
        .send({ email: adminUser.email, password: adminUser.plainPassword })
        .end(function(err, res) {
          var result = JSON.parse(res.text);
          adminUserToken = result.token;
        });

      chai.request(app)
        .post('/authenticate')
        .type('form')
        .send({ email: testUser.email, password: testUser.plainPassword })
        .end(function(err, res) {
          var result = JSON.parse(res.text);
          testUserToken = result.token;
          done();
        });
    });
  });

  beforeEach(function(done) {
    fixtures.clearAllAndLoad(__dirname + '/fixtures', function(err) {
      done();
    });
  });

  describe('/GET items', () => {
    it('it should list own items if authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(3);
          res.body[0].should.include.keys('name', 'owner');
          done();
        });
    });

    it('it should not list items if is not authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items')
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('name', 'owner');
        done();
      });
    });

    it('it should not list other user items if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('name', 'owner');
        done();
      });
    });
  });
});
