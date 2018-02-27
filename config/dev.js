module.exports = {
  server: {
    port: 9000
  },
  database: {
    url: 'mongodb://db/node-express-skeleton-dev',
    properties: {
      useMongoClient: true
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
