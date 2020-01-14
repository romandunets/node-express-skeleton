/**
 * https://mongoosejs.com/docs/
 * $ npm install mongoose
 */
const Mongoose = require('mongoose')
const config = require('../config/dev');

Mongoose.connect(config.database.url, config.database.properties);

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error.'));
db.once('open', function callback() {
  console.log("Connection with MongoDB succeeded.");
});

exports.db = db;