const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  email: {type: String, required: true},
  password: {type: String, required: true},
  hash: {type: String},
  salt: {type:String},
  profPhoto: String,
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
