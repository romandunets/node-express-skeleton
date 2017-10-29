var id = require('pow-mongodb-fixtures').createObjectId;

var users = exports.users = {
  user: {
    _id: id('59b50d152d9f6b4110ec9a68'),
    email: 'user@mail.com',
    password: '$2a$10$K/keYuNU.AE88ITdjZSJp.IkPr65Z9nkzcVxT3lrHClPDceulcnty',
    items: []
  },
  admin: {
    _id: id('59b50d092d9f6b4110ec9a66'),
    email: 'admin@mail.com',
    password: '$2a$10$hzIYXaTrFzxZZjr7Pqb0A.EnzVberIzYTpV5czFcmkSQeTGkatueW',
    items: []
  },
  test: {
    _id: id('59b50d102d9f6b4110ec9a67'),
    email: 'test@mail.com',
    password: '$2a$10$P3LGIOzh6NTesXMr.swM3u1A0HKQ2t.3FCH81BdsJRcLhM1.kApEe',
    items: []
  }
}
