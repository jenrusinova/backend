const mongoose = require("mongoose");
if (process.env.status === "production") {
  console.log("production")
  mongoose.connect(process.env.uri);
} else {
  mongoose.connect('mongodb://localhost:27017/petpics');
}

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

module.exports = db;
