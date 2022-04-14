const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const passport = require ('passport');
const genPassword = require ('../../lib/passwordUtils.js').genPassword;
const User = require('../../database/models/User');


const {
  addNewUser,
  getUser,
  followUser,
  getUserMeta,
  changeProfilePhoto,
} = require("../../database/controllers/User");

//GET REQUESTS

//request parameteer must include username --- returns userInfo (user metadata and posts)
router.get("/getUser/:username", async (req, res) => {
  try {
    const { userInfo, posts } = await getUser(
      req.params.username.toLowerCase()
    );
    res.send({ userInfo, posts });
  } catch (err) {
    res.send(err);
  }
});

router.get("/getUserMeta/:username", async (req, res) => {
  try {
    const { username, profPhoto } = await getUserMeta(
      req.params.username.toLowerCase()
    );
    res.send({ username, profPhoto });
  } catch (err) {
    res.send(err);
  }
});

//POST REQUESTS

//input must be in form {username, email, password} -- returns username
router.post("/addNewUser", async (req, res) => {

  const body = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);
  const user = {
    username: body.username,
    email: body.email,
    password: hashedPassword
  };

  console.log('user', user);

  try {
    const newUser = await addNewUser(user);
    res.send(newUser.username);
  } catch (err) {
    if (err.code === 11000) {
      res.send("already a user");
    } else {
      res.send(err);
    }
  }

  // compare input pw to hashed pw
  // const password = await bcrypt.compare(req.body.password, hashedPassword, (err, hash) => {
  //   if (err) {
  //     console.log('ERR ', err);
  //   } else {
  //     console.log('RES ', hash);
  //   }
  // })
});


router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/login/federated/google', passport.authenticate('google'));
// router.get("/login/federated/google", async (req, res) => {
//  res.send('hello');
// });

// router.get('/oauth2/redirect/google', passport.authenticate('google', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));



router.post("/followUser", async (req, res) => {
  try {
    const { currentUserID, otherID } = req.body;
    await followUser(currentUserID, otherID);
    res.send("succesfully followed");
  } catch (err) {
    res.send(err);
  }
});

router.post("/profPhoto", async (req, res) => {
  try {
    const user = await changeProfilePhoto(req.body)
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
