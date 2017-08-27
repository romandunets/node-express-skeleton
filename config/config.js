module.exports = {
  server: {
    host: 'localhost',
    port: 3000
  },
  database: {
    host: 'localhost',
    port: 27017,
    db: 'login',
    url: 'mongodb://127.0.0.1:27017/login'
  },
  key: {
    privateKey: '37LvDSm4XvjYOh9Y',
    tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
  },
  email: {
    username: "sendermailid",
    password: "senderpassword",
    verifyEmailUrl: "verifyEmail",
    resetEmailUrl: "reset"
  }
};
