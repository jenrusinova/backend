require("dotenv").config();
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oidc');
const TwitterStrategy = require('passport-twitter').Strategy;

const connection = require('../database/index.js');
const User = require('../database/models/User.js');
const Credentials = require('../database/models/FederatedCredentials.js');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        console.log('no such user');
        return cb(null, false);
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          console.error(err);
          console.log('password is not valid');
          return cb(null, false);
        } else {
          if (res) {
            console.log('password is valid');
            return cb(null, user);
          } else {
            console.log('password is not valid');
            return cb(null, false);
          }
        }
      })
    })
    .catch((err) => {
      cb(err);
    });
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
},
  function (issuer, profile, cb) {
    //take data with profile.id and provider
    Credentials.findOne({ provider: issuer, subject: profile.id })
      .then((user) => {
        //if no data is found
        if (!user) {
          //add this user to a user table
          let newUser = new User({
            username: profile.displayName.toLowerCase(),
            email: profile.emails[0].value,
            active: true
          })
          newUser.save();

          //add new credentials
          //add username instead of user id
          let newCredentials = new Credentials({
            user_id: profile.displayName.toLowerCase(),
            provider: issuer,
            subject: profile.id
          });
          newCredentials.save();
          return cb(null, newUser);
        }

        //if user is exists
        //return this user
        let username = profile.displayName.toLowerCase();
        User.findOne({ username: username })
          .then((user) => {
            console.log('found user', user.username);
            return cb(null, user);
          })
          .catch(err => {
            console.log('user not found');
            return cb(err);
          })
      })
      .catch((err) => {
        cb(err);
      });
  }
));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://localhost:3000/user/auth/twitter/callback',
  userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
},
  function (token, tokenSecret, profile, cb) {
    let username = profile.username;
    let email = profile['emails'][0]['value'];

    User.findOrCreate({ username: username, email: email, active: true }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
