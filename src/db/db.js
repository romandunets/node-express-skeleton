import Mongoose from 'mongoose';
import config from 'config';

Mongoose.connect(config.database.url, config.database.properties);

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error.'));
db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

exports.db = db;
