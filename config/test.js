module.exports = {
  server: {
    port: 3001
  },
  database: {
    url: 'mongodb://localhost/node-express-skeleton-test',
    properties: {
      useMongoClient: true
    }
  },
  key: {
    privateKey: '37LvDSm4XvjYOh9Y',
    tokenExpireInMinutes: 1440
  }
};
