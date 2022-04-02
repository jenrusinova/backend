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

const getFollowing = async (username) => {
  const followingList = await User.findOne({ username }).select('following -_id');
  return followingList;
};

//can implement later
//changeUsername(userID)
//update username of user
//map through everyone in user's followers array
//update each user's following array (the entry containing the userID)

module.exports = { addNewUser, getUser, followUser, getFollowing };
