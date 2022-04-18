require("dotenv").config();
const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = express.Router();
// const genPassword = require ('../../lib/passwordUtils.js').genPassword;
const User = require('../../database/models/User');


const {
  addNewUser,
  getUser,
  followUser,
  getUserMeta,
  changeProfilePhoto,
  notification,
} = require("../../database/controllers/User");

const { transport } = require("../../nodemailer");

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

router.get("/validate/:userid", async (req, res) => {
  try {
    const id = req.params.userid;
    const valid = await validateUser(id);
    res.send('Account Successfully Validated!');
  } catch (err) {
    res.send(err);
  }
});

router.get("/auth/twitter", passport.authenticate('twitter'));

router.use("/auth/twitter/callback",
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    let username = req.user.username;
    let email = req.user.email;
    res.redirect(`exp://10.0.0.251:19000/?username=${username}&email=${email}`);
  }
);

router.get("/auth/twitter/terms", (req, res) => {
  // required in order to get twitter user emails
  res.send('Terms of service and privacy policy here');
});

router.get('/login/federated/google', passport.authenticate('google'));

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

  try {
    const newUser = await addNewUser(user);
    const validatedURL = `http://127.0.0.1:3000/user/validate/${newUser._id}`;

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: newUser.email,
      subject: 'PetPix Account Verification',
      html: `
        <div>
          <p>Welcome to PetPix! Please verify your account.</p>
          <button>${validatedURL}</button>
        </div>
      `
    }

    transport.sendMail(mailOptions, (err, result) => {
      if (err) {
        // res.send(err);
      } else {
        transport.close();
      }
    })

    res.send(newUser.username);
  } catch (err) {
    if (err.code === 11000) {
      res.send("already a user");
    } else {
      res.send(err);
    }
  }
});

router.post("/followUser", async (req, res) => {
  try {
    const { currentUserID, otherID } = req.body;
    await followUser(currentUserID, otherID);
    res.send("succesfully followed");
  } catch (err) {
    res.send(err);
  }
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.patch("/profPhoto", async (req, res) => {
  try {
    const user = await changeProfilePhoto(req.body)
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

//body must be in form {fromuser, touser, url} -- returns username
router.post("/screenshot", async (req, res) => {
  try {
    const { fromuser, touser, url, caption } = req.body;
    const newNotification = await notification(fromuser, touser, url, caption);
    res.status(200).json(newNotification)
    // console.log(newNotification)
  } catch (err) {
    res.status(400).send(err);
    // console.log(err);
  }
});

module.exports = router;
