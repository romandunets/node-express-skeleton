const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('Index', () => {

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
