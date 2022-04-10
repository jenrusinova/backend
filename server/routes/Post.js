const express = require("express");
const router = express.Router();

const {
  uploadPost,
  getDiscoveryPosts,
  commentOnPost,
} = require("../../database/controllers/Post");

//GET REQUESTS

//input must be in form url/post/discover?limit=10&offset=10
router.get("/discover", async (req, res) => {
  const { limit, offset } = req.query;
  try {
    const discoverFeed = await getDiscoveryPosts(+limit, +offset);
    res.send(discoverFeed);
  } catch (err) {
    res.send(err);
  }
});

//POST REQUESTS

//body must be in form {username, profPhoto, location, url, caption} -- returns username
router.post("/uploadPost", async (req, res) => {
  try {
    const newPost = await uploadPost(req.body);
    res.send(newPost.url);
  } catch (err) {
    res.send(err);
  }
});

//input must be in form {postID, username, comment} -- returns username
router.post("/comment", async (req, res) => {
  try {
    const { postID, username, comment } = req.body;
    await commentOnPost(postID, username, comment);
    res.send("comment successfully inserted");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
