const User = require("../models/User");
const { getUserPosts } = require("./Post");

//possibly add .lean() in the future

const addNewUser = async (userData) => {
  const user = new User(userData);
  const newUser = await user.save();
  return newUser;
};

const getUser = async (username) => {
  const userInfo = await User.findOne({ username }).exec();
  const posts = await getUserPosts(username);
  return { userInfo, posts };
};

const followUser = async (username, followedUser) => {
  await User.updateOne(
    { username },
    { $addToSet: { following: followedUser } }
  );
  await User.updateOne(
    { username: followedUser },
    { $addToSet: { followers: username } }
  );
};

module.exports = { addNewUser, getUser, followUser };
