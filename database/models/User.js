const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  password: String,
  profPhoto: String,
  following: [{ type: String, unique: true}],
  followers: [{ type: String, unique: true}],
});

module.exports = mongoose.model("User", userSchema);
