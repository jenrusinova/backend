const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  email: {type: String, unique: true, required: true},
  password: {type: String},
  profPhoto: String,
  following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  followers: [],
  active: {type: Boolean, default: false}
});

userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
module.exports = User;
