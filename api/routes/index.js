const routes = require('express').Router();

const auth = require('./auth');
const users = require('./users');
const words = require('./words');

routes.use('/authenticate', auth);
routes.use('/users', users);
routes.use('/words', words);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});

module.exports = routes;
