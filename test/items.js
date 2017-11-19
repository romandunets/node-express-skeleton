const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');
var responseHelper = require('./helpers/response');
var itemHelper = require('./helpers/item');
var userFixtures = require('./fixtures/users');
var itemFixtures = require('./fixtures/items');
var fixtures = require('pow-mongodb-fixtures').connect('mongodb://localhost/node-express-skeleton-test');

describe('Items', () => {

  var adminUser = userFixtures.users.admin;
  var testUser = userFixtures.users.test;

  var adminItem1 = itemFixtures.items.adminItem1;
  var testItem1 = itemFixtures.items.testItem1;

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

  describe('/GET users/:userId/items', () => {
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

    it('it should return not found if user id is not found', (done) => {
      chai.request(app)
        .get('/users/12345678/items')
        .end((err, res) => {
          responseHelper.assertNotFound(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });
  });

  describe('/GET users/:userId/items/:id', () => {
    it('it should get item details data if authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          itemHelper.assertItem(res, adminItem1);
          done();
        });
    });

    it('it should not get item details data if is not authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should return not found error if item id does not exist', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items/12345678')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          responseHelper.assertNotFound(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should get other user item details data if authorized and has admin rights', (done) => {
      chai.request(app)
        .get('/users/' + testUser._id + '/items/' + testItem1._id)
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          itemHelper.assertItem(res, testItem1);
          done();
        });
    });

    it('it should not get other user item details data if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });
  });

  describe('/POST users/:userId/items', () => {
    var newItem = {
      name: 'newItem1'
    };

    it('it should create a new item for user if authorized', (done) => {
      chai.request(app)
        .post('/users/' + adminUser._id + '/items/')
        .set('x-access-token', adminUserToken)
        .type('form')
        .send(newItem)
        .end((err, res) => {
          itemHelper.assertItem(res, newItem);
          done();
        });
    });

    it('it should not create a new item for user if not authorized', (done) => {
      chai.request(app)
        .post('/users/' + adminUser._id + '/items/')
        .type('form')
        .send(newItem)
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should not create a new item for other user if user is authorized and has admin rights', (done) => {
      chai.request(app)
        .post('/users/' + testUser._id + '/items/')
        .set('x-access-token', adminUserToken)
        .type('form')
        .send(newItem)
        .end((err, res) => {
          itemHelper.assertItem(res, newItem);
          done();
        });
    });

    it('it should not create a new item for other user if user is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .post('/users/' + adminUser._id + '/items/')
        .set('x-access-token', testUserToken)
        .type('form')
        .send(newItem)
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should not create a new item without name', (done) => {
      chai.request(app)
        .post('/users/' + adminUser._id + '/items/')
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ name: '' })
        .end((err, res) => {
          responseHelper.assertBadRequest(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });
  });
});
