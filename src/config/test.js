const host = process.env.DB_HOST || 'localhost';

module.exports = {
  server: {
    port: 9001
  },
  database: {
    url: `mongodb://${host}/node-express-skeleton-test`,
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
