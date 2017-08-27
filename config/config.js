module.exports = {
  server: {
    port: 3000
  },
  database: {
    url: 'mongodb://localhost/wordlistdb',
    properties: {
        useMongoClient: true
    }
  },
  key: {
    privateKey: '37LvDSm4XvjYOh9Y',
    tokenExpireInMinutes: 1440
  }
};
