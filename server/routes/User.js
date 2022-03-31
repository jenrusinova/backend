const express = require("express");
const router = express.Router();

const {
  addNewUser,
  getUser,
  followUser,
  getFollowing,
} = require("../../database/controllers/User");

//GET REQUESTS

//request parameteer must include username --- returns userInfo (user metadata and posts)
router.get("/getUser/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const { userInfo, posts } = await getUser(username);
    res.send({ userInfo, posts });
  } catch (err) {
    res.send(err);
  }
});

router.get("/getFollowing/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const following = await getFollowing(username);
    res.send(following);
  } catch (err) {
    res.send(err);
  }
});

//POST REQUESTS

//input must be in form {username, password, profPhoto} -- returns username
router.post("/addNewUser", async (req, res) => {
  try {
    const newUser = await addNewUser(req.body);
    res.send(newUser.username);
  } catch (err) {
    if (err.code === 11000) {
      res.send("already a user");
    } else {
      res.send(err);
    }
  }
});

//input must be in form {username, followedUser} -- returns username
router.post("/followUser", async (req, res) => {
  try {
    const { username, followedUser } = req.body;
    await followUser(username, followedUser);
    res.send("succesfully followed");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
