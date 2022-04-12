const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  profPhoto: String,
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
