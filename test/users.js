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
          res.body.should.have.lengthOf(3);
          res.body[0].should.include.keys('email', 'items', 'role');
          res.body[0].should.not.include.keys('password');
        done();
      });
    });

    it('it should not list all users if is not authorized', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.to.deep.equal({'success': false, 'message': 'No token provided.'});
          res.body.should.not.include.keys('email', 'items', 'role');
        done();
      });
    });

    it('it should not list all users if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .get('/users')
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(403);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false, 'message': 'You do not have rights to access this resource.'});
          res.body.should.not.include.keys('email', 'items', 'role');
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
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.include.keys('email', 'items', 'role');
          res.body.should.not.include.keys('password');
        done();
      });
    });

    it('it should not get a single user data if is not authorized', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id)
        .end((err, res) => {
          res.should.have.status(401);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.to.deep.equal({'success': false, 'message': 'No token provided.'});
          res.body.should.not.include.keys('email', 'items', 'role');
        done();
      });
    });

    it('it should return not found error if user id does not exist', (done) => {
      chai.request(app)
        .get('/users/5432645363456')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false, 'message': 'Resource not found.'});
          res.body.should.not.include.keys('email', 'items', 'role');
        done();
      });
    });

    it('it should get other user data if authorized and has admin rights', (done) => {
      chai.request(app)
        .get('/users/' + testUser._id)
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.include.keys('email', 'items', 'role');
          res.body.should.not.include.keys('password');
        done();
      });
    });

    it('it should not get other user data if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id)
        .set('x-access-token', testUserToken)
        .end((err, res) => {
          res.should.have.status(403);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false, 'message': 'You do not have rights to access this resource.'});
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
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({ email: newUser.email, role: 'user' });
          res.body.should.not.include.keys('password');
          done();
        });
    });

    it('it should not create a new user without email', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send({ email: '', password: newUser.password })
        .end((err, res) => {
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false});
          res.body.should.include.keys('success', 'message');
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
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false});
          res.body.should.include.keys('success', 'message');
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should not create a new user with email used by existing user', (done) => {
      chai.request(app)
        .post('/users')
        .type('form')
        .send({ email: testUser.email, password: testUser.plainPassword })
        .end((err, res) => {
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false});
          res.body.should.include.keys('success', 'message');
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
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({ email: newUser.email, role: 'user' });
          res.body.should.not.include.keys('password');
          done();
        });
    });
  });

  describe('/PUT users', () => {
    it('it should update own user data if is authorized', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ email: 'new@mail.com' })
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({ email: 'new@mail.com', role: 'admin' });
          res.body.should.not.include.keys('password');
          done();
        });
    });

    it('it should not update user data if is not authorized', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .type('form')
        .send({ email: 'new@mail.com' })
        .end((err, res) => {
          res.should.have.status(401);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.to.deep.equal({'success': false, 'message': 'No token provided.'});
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
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({ email: 'new@mail.com', role: 'user' });
          res.body.should.not.include.keys('password');
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
          res.should.have.status(403);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false, 'message': 'You do not have rights to access this resource.'});
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
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false});
          res.body.should.include.keys('success', 'message');
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
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false});
          res.body.should.include.keys('success', 'message');
          res.body.should.not.include.keys('email', 'items', 'role');
          done();
        });
    });

    it('it should not update user data with email used by existing user', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ email: testUser.email, password: testUser.plainPassword })
        .end((err, res) => {
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({'success': false});
          res.body.should.include.keys('success', 'message');
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
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.contain({ email: testUser.email, role: 'user' });
          res.body.should.not.include.keys('password');
          done();
        });
    });
  });
});
