const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

var app = require('../app');

describe('Index', () => {

  describe('/GET index', () => {
    it('it should GET message ok', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.to.deep.equal({'message': 'Ok'});
          done();
        });
    });
  });

  describe('/GET unexisting page', () => {
    it('it should return 404', (done) => {
      chai.request(app)
        .get('/unexisting')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

});
