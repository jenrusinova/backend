require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const {
  addNewUser,
  getUser,
  followUser,
  getUserMeta,
  changeProfilePhoto,
  validateUser
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
})

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
        res.send(err);
      } else {
        transport.close();
        // res.send({
        //   message: 'Email has been sent!'
        // })
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

router.post("/profPhoto", async (req, res) => {
  try {
    const user = await changeProfilePhoto(req.body)
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
