const mongoose = require("mongoose");
const { host, dbPort, database } = require("../constants");
mongoose.connect(`mongodb://${host}:${dbPort}/${database}`);

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

module.exports = db;
