const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  profPhoto: String,
  following: [],
  followers: [],
});

module.exports = mongoose.model("User", userSchema);
