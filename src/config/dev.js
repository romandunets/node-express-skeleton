/**
 * https://www.npmjs.com/package/config
 * $ npm install config
 */
const host = process.env.DB_HOST || 'localhost';
const dbname = 'node-copybanking-dev';

module.exports = {
  server: {
    port: 27017
  },
  database: {
    url: `mongodb://${host}/${dbname}`,
    properties: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  },
  key: {
    privateKey: '37LvDSm4XvjYOh9Y',
    tokenExpireInMinutes: 1440
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10
  }
};
