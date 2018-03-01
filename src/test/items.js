import mongoose from 'mongoose';

import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';
import responseHelper from './helpers/response';
import itemHelper from './helpers/item';
import userFixtures from './fixtures/users';
import itemFixtures from './fixtures/items';

const should = chai.should();
chai.use(chaiHttp);

const fixtures = require('pow-mongodb-fixtures')
  .connect('mongodb://localhost/node-express-skeleton-test');

describe('Items', () => {

  const adminUser = userFixtures.users.admin;
  const testUser = userFixtures.users.test;

  const adminItem1 = itemFixtures.items.adminItem1;
  const testItem1 = itemFixtures.items.testItem1;

  let adminUserToken = '';
  let testUserToken = '';

  before(function(done) {
    fixtures.clearAllAndLoad(__dirname + '/fixtures', function(err) {
      chai.request(app)
        .post('/authenticate')
        .type('form')
        .send({ email: adminUser.email, password: adminUser.plainPassword })
        .end(function(err, res) {
          const result = JSON.parse(res.text);
          adminUserToken = result.token;
        });

      chai.request(app)
        .post('/authenticate')
        .type('form')
        .send({ email: testUser.email, password: testUser.plainPassword })
        .end(function(err, res) {
          const result = JSON.parse(res.text);
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
          res.body.should.have.lengthOf(5);
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

    it('it should paginate items list with custom parameters', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items?page=1&pageSize=3')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(3);
          res.body[0].name.should.be.equal(itemFixtures.items.adminItem1.name);
          res.body[1].name.should.be.equal(itemFixtures.items.adminItem2.name);
          res.body[2].name.should.be.equal(itemFixtures.items.adminItem3.name);
          res.header['pagination-count'].should.be.equal('5');
          res.header['pagination-page'].should.be.equal('1');
          res.header['pagination-limit'].should.be.equal('3');
          done();
        });
    });

    it('it should sort items list by name in ascending order', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items?sort=name')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body[0].name.should.be.equal(itemFixtures.items.adminItem1.name);
          res.body[1].name.should.be.equal(itemFixtures.items.adminItem2.name);
          res.body[2].name.should.be.equal(itemFixtures.items.adminItem3.name);
          res.body[3].name.should.be.equal(itemFixtures.items.adminItem4.name);
          res.body[4].name.should.be.equal(itemFixtures.items.adminItem5.name);
          done();
        });
    });

    it('it should sort items list by name in descending order', (done) => {
      chai.request(app)
        .get('/users/' + adminUser._id + '/items?sort=-name')
        .set('x-access-token', adminUserToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('array');
          res.body[0].name.should.be.equal(itemFixtures.items.adminItem5.name);
          res.body[1].name.should.be.equal(itemFixtures.items.adminItem4.name);
          res.body[2].name.should.be.equal(itemFixtures.items.adminItem3.name);
          res.body[3].name.should.be.equal(itemFixtures.items.adminItem2.name);
          res.body[4].name.should.be.equal(itemFixtures.items.adminItem1.name);
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
    const newItem = {
      name: 'newItem1'
    };

    it('it should create a new item for user if authorized', (done) => {
      chai.request(app)
        .post('/users/' + adminUser._id + '/items/')
        .set('x-access-token', adminUserToken)
        .type('form')
        .send(newItem)
        .end((err, res) => {
          itemHelper.assertCreatedItem(res, newItem);
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

    it('it should create a new item for other user if user is authorized and has admin rights', (done) => {
      chai.request(app)
        .post('/users/' + testUser._id + '/items/')
        .set('x-access-token', adminUserToken)
        .type('form')
        .send(newItem)
        .end((err, res) => {
          itemHelper.assertCreatedItem(res, newItem);
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

  describe('/PUT users/:userId/items/:id', () => {
    it(' it should update own item data if is authorized', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ name: 'newName' })
        .end((err, res) => {
          itemHelper.assertItem(res, { name: 'newName' });
          done();
        });
    });

    it('it should not update item data if is not authorized', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .type('form')
        .send({ name: 'newName' })
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should update item data for other user if user is authorized and has admin rights', (done) => {
      chai.request(app)
        .put('/users/' + testUser._id + '/items/' + testItem1._id)
        .set('x-access-token', adminUserToken)
        .type('form')
        .send({ name: 'newName' })
        .end((err, res) => {
          itemHelper.assertItem(res, { name: 'newName' });
          done();
        });
    });

    it('it should not create update item data for other user if user is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .put('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .set('x-access-token', testUserToken)
        .type('form')
        .send({ name: 'newName' })
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });
  });

  describe('/DELETE users/:userId/items/:id', () => {
    it('it should delete item data if is authorized', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .set('x-access-token', adminUserToken)
        .send()
        .end((err, res) => {
          itemHelper.assertDoesNotContainItemData(res, 'Item successfully deleted');
          done();
        });
    });

    it('it should not delete user data if is not authorized', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .send()
        .end((err, res) => {
          responseHelper.assertNotAuthorized(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should delete other user data if is authorized and has admin rights', (done) => {
      chai.request(app)
        .delete('/users/' + testUser._id + '/items/' + testItem1._id)
        .set('x-access-token', adminUserToken)
        .send()
        .end((err, res) => {
          itemHelper.assertDoesNotContainItemData(res, 'Item successfully deleted');
          done();
        });
    });

    it('it should not delete other user data if is authorized but does not have admin rights', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id + '/items/' + adminItem1._id)
        .set('x-access-token', testUserToken)
        .send()
        .end((err, res) => {
          responseHelper.assertForbidden(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });

    it('it should return not found if item id is not found', (done) => {
      chai.request(app)
        .delete('/users/' + adminUser._id + '/items/123456789')
        .set('x-access-token', adminUserToken)
        .send()
        .end((err, res) => {
          responseHelper.assertNotFound(err, res);
          res.body.should.not.include.keys('name', 'owner');
          done();
        });
    });
  });
});
