var bcrypt = require('bcrypt');
var id = require('pow-mongodb-fixtures').createObjectId;

exports.users = {
  user: {
    _id: id('59b50d152d9f6b4110ec9a68'),
    email: 'user@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'user',
    items: []
  },
  admin: {
    _id: id('59b50d092d9f6b4110ec9a66'),
    email: 'admin@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'admin',
    items: []
  },
  test: {
    _id: id('59b50d102d9f6b4110ec9a67'),
    email: 'test@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'user',
    items: []
  }
}
