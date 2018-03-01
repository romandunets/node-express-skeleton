import bcrypt from 'bcrypt';
import { createObjectId } from 'pow-mongodb-fixtures';

exports.users = {
  user: {
    _id: createObjectId('59b50d152d9f6b4110ec9a68'),
    email: 'user@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'user',
    items: []
  },
  admin: {
    _id: createObjectId('59b50d092d9f6b4110ec9a66'),
    email: 'admin@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'admin',
    items: [
      createObjectId('59b50d152d9f6b4110ec9a11'),
      createObjectId('59b50d152d9f6b4110ec9a12'),
      createObjectId('59b50d152d9f6b4110ec9a13')
    ]
  },
  test: {
    _id: createObjectId('59b50d102d9f6b4110ec9a67'),
    email: 'test@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'user',
    items: [
      createObjectId('59b50d152d9f6b4110ec9a21'),
      createObjectId('59b50d152d9f6b4110ec9a22'),
      createObjectId('59b50d152d9f6b4110ec9a23')
    ]
  },
  test1: {
    _id: createObjectId('59b50d102d9f6b4110ec9a65'),
    email: 'test1@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'user',
    items: []
  },
  test2: {
    _id: createObjectId('59b50d102d9f6b4110ec9a66'),
    email: 'test2@mail.com',
    plainPassword: 'password',
    password: bcrypt.hashSync('password', 10),
    role: 'user',
    items: []
  }
}
