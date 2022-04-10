const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  profPhoto: String,
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
