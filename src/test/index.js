import mongoose from 'mongoose';

import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';
import responseHelper from './helpers/response';

const should = chai.should();
chai.use(chaiHttp);

describe('Index', () => {

  describe('/GET index', () => {
    it('it should GET message ok', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          responseHelper.assertObject(res, {'message': 'Ok'});
          done();
        });
    });
  });

  describe('/GET unexisting page', () => {
    it('it should return 404', (done) => {
      chai.request(app)
        .get('/unexisting')
        .end((err, res) => {
          responseHelper.assertNotFound(err, res);
          done();
        });
    });
  });

});
