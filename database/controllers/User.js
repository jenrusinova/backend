const User = require("../models/User");
const Notification = require("../models/Notification");
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

const notification = async (fromuser, touser, url, caption) => {
  // console.log('all', fromuser, touser, url, caption);
  const notificationInfo = new Notification({
    fromuser: fromuser.toLowerCase(),
    touser: touser.toLowerCase(),
    url: url,
    caption: caption || null,
  });
  await notificationInfo.save(function (err, data) {
    if (err) {
      console.log('err', err);
    } else {
      return data;
    }
  });
};

module.exports = {
  addNewUser,
  getUser,
  followUser,
  getUserMeta,
  changeProfilePhoto,
  notification,
};
