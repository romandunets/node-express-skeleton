const mongoose = require("mongoose");
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {

  describe('/GET index', () => {
    it('it should GET message ok', (done) => {
      chai.request('http://localhost:3000')
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.to.deep.equal({'message': 'Ok'});
        done();
      });
    });
  });

});
