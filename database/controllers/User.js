const User = require("../models/User");
const { getUserPosts } = require("./Post");

//possibly add .lean() in the future

const addNewUser = async (userData) => {
  userData.username = userData.username.toLowerCase();
  const user = new User(userData);
  const newUser = await user.save();
  return newUser;
};

const getUser = async (username) => {
  const userInfo = await User.findOne({ username }).exec();
  const posts = await getUserPosts(username);
  return { userInfo, posts };
};

const getUserMeta = async (username) => {
  const userInfo = await User.findOne({ username }).exec();
  return userInfo;
};

const followUser = async (
  username,
  userProfPic,
  followedUser,
  followedProfPic
) => {
  await User.updateOne(
    { username },
    { $addToSet: { following: { followedUser, followedProfPic } } }
  );
  await User.updateOne(
    { username: followedUser },
    { $addToSet: { followers: { username, userProfPic } } }
  );
};

module.exports = { addNewUser, getUser, followUser, getUserMeta };
