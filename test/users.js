const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');
var responseHelper = require('./helpers/response');
var userHelper = require('./helpers/user');
var userFixtures = require('./fixtures/users');
var fixtures = require('pow-mongodb-fixtures').connect('mongodb://localhost/node-express-skeleton-test');

describe('Users', () => {

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

  describe('/GET users', () => {
    it('it should list all users if authorized', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(5);
          res.body[0].should.include.keys('email', 'items', 'role');
          res.body[0].should.not.include.keys('password');
          done();
        });
    });

    it('it should not list all users if is not authorized', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should not list all users if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should paginate users list with custom parameters', (done) => {
      chai.request(app)
        .get('/users?page=1&pageSize=3')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(3);
          res.body[0].email.should.be.equal('user@mail.com');
          res.body[1].email.should.be.equal('admin@mail.com');
          res.body[2].email.should.be.equal('test@mail.com');
          res.header['pagination-count'].should.be.equal('5');
          res.header['pagination-page'].should.be.equal('1');
          res.header['pagination-limit'].should.be.equal('3');
          done();
        });
    });
  });

  describe('/GET users/:id', () => {
    it('it should get a own user data if authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          userHelper.assertUser(res, adminUser);
          done();
      });
    });

    it('it should not get a single user data if is not authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id)
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
        done();
      });
    });

    it('it should return not found error if user id does not exist', (done) => {
      chai.request(app)
        .get('/users/5432645363456')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          responseHelper.assertNotFound(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
        done();
      });
    });

    it('it should get other user data if authorized and has admin rights', (done) => {
      chai.request(app)
        .get('/users/' + testUser._id)
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          userHelper.assertUser(res, testUser);
          done();
        });
    });

    it('it should not get other user data if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id)
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
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
          userHelper.assertUser(res, { email: newUser.email, role: 'user' });
          done();
        });
    });

    it('it should not create a new user without email', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send({ email: '', password: newUser.password })
        .end((err, res) => {
          responseHelper.assertBadRequest(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should not create a new user without password', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send({ email: newUser.email, password: '' })
        .end((err, res) => {
          responseHelper.assertBadRequest(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should create a new user but ignore role field', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send({ email: newUser.email, password: newUser.password, role: 'admin' })
        .end((err, res) => {
          userHelper.assertUser(res, { email: newUser.email, role: 'user' });
          done();
        });
    });
  });

  describe('/PUT users/:id', () => {
    it('it should update own user data if is authorized', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ email: 'new@mail.com' })
        .end((err, res) => {
          userHelper.assertUser(res, { email: 'new@mail.com', role: 'admin' });
          done();
        });
    });

    it('it should not update user data if is not authorized', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .type('form')
        .send({ email: 'new@mail.com' })
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should update an existing user if is authorized and has admin rights', (done) => {
      chai.request(app)
        .put('/users/' + testUser._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ email: 'new@mail.com' })
        .end((err, res) => {
          userHelper.assertUser(res, { email: 'new@mail.com', role: 'user' });
          done();
        });
    });

    it('it should not update an existing user if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .set('x-access-token', testUserToken)
        .type('form')
        .send({ email: 'new@mail.com' })
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should not update user data with empty email', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ email: '' })
        .end((err, res) => {
          responseHelper.assertBadRequest(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should not update user data with empty password', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ password: '' })
        .end((err, res) => {
          responseHelper.assertBadRequest(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should update a new user but ignore role field', (done) => {
      chai.request(app)
        .put('/users/' + testUser._id)
        .set('x-access-token', testUserToken)
        .type('form')
        .send({ role: 'admin' })
        .end((err, res) => {
          userHelper.assertUser(res, testUser);
          done();
        });
    });
  });

  describe('/DELETE user/:id', () => {
    it('it should delete own user data if is authorized', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .send()
        .end((err, res) => {
          userHelper.assertDoesNotContainUserData(res, 'User successfully deleted');
          done();
        });
    });

    it('it should not delete user data if is not authorized', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id)
        .send()
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should delete other user data if is authorized and has admin rights', (done) => {
      chai.request(app)
        .delete('/users/' + testUser._id)
        .set('x-access-token', adminUserToken)
        .send()
        .end((err, res) => {
          userHelper.assertDoesNotContainUserData(res, 'User successfully deleted');
          done();
        });
    });

    it('it should not delete other user data if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id)
        .set('x-access-token', testUserToken)
        .send()
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });
  });
});
