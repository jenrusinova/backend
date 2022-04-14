const User = require("../models/User");
const mongoose = require("mongoose");
const { getUserPosts } = require("./Post");

//possibly add .lean() in the future

const addNewUser = async (userData) => {
  userData.username = userData.username.toLowerCase();
  const user = new User(userData);
  const newUser = await user.save();
  return newUser;
};

const getUser = async (username) => {
  const userInfo = await User.findOne({ username })
    .populate("following", "username profPhoto")
    .exec();
  const posts = await getUserPosts(username);
  return { userInfo, posts };
};

const getUserMeta = async (username) => {
  const userInfo = await User.findOne({ username }).exec();
  return userInfo;
};

const changeProfilePhoto = async ({ username, profPhoto }) => {
  const user = await User.findOneAndUpdate(
    { username },
    { profPhoto },
    {
      new: true,
    }
  );
  return user;
};

const followUser = async (currentUserID, otherID) => {
  await User.findByIdAndUpdate(currentUserID, {
    $addToSet: { following: mongoose.Types.ObjectId(otherID) },
  });
  await User.findByIdAndUpdate(otherID, {
    $addToSet: { followers: mongoose.Types.ObjectId(currentUserID) },
  });
};

const validateUser = async (currentUserID) => {
  await User.findByIdAndUpdate(currentUserID, {
    active: true
  })
}

module.exports = {
  addNewUser,
  getUser,
  followUser,
  getUserMeta,
  changeProfilePhoto,
  validateUser
};
