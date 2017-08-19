const routes = require('express').Router();

const auth = require('./auth');
const users = require('./users');
const items = require('./items');

routes.use('/', auth);
routes.use('/users', users);
routes.use('/items', items);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Ok' });
});

module.exports = routes;
