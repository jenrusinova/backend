require("dotenv").config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oidc');
const TwitterStrategy = require('passport-twitter').Strategy;
const connection = require ('../database/index.js');
const User = require('../database/models/User.js');
const Credentials = require('../database/models/FederatedCredentials.js');
// const validPassword = require ('../lib/passwordUtils.js').validPassword;
const bcrypt = require('bcrypt');


passport.use(new LocalStrategy(function verify(username, password, cb) {
  console.log('username', username);
  console.log('input password', password);
  User.findOne({username: username})
    .then((user) => {
      if (!user){
        console.log('no such user');
        return cb (null, false);
      }

  console.log('received password', password);
  console.log('password from db', user.password);
  bcrypt.compare(password, user.password, (err, res) => {
    if (err) {
      console.error(err);
      console.log('password is not valid');
      return cb (null, false);
    }
    else {
      if (res){
      console.log('password is valid');
      return cb(null, user);
      } else {
        console.log('password is not valid');
        return cb (null, false);
      }
    }
  })
       })
        .catch ((err) => {
          cb (err);
        });
  }));


  passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    //scope: [ 'profile' ]
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
  ]
  },
  function(issuer, profile, cb) {

    //take data with profile.id and provider
    Credentials.findOne({provider: issuer, subject: profile.id} )
    .then((user) => {
      //if no data is found
      if (!user){
        //console.log('passport line 58');
        //console.log('profile', profile);
        //add this user to a user table
      let newUser = new User({
        username: profile.displayName.toLowerCase(),
        email: profile.emails[0].value
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
      } //if user is exists
        //return this user
        //console.log('passport line 74');
        User.findOne({username: profile.displayName}).
        then((user) => {
          //console.log('found user', user);
          return cb(null, user);
        })

       })
        .catch ((err) => {
          cb (err);
        });
      }

  ));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://127.0.0.1:3000/user/auth/twitter/callback'
  },
  function (token, tokenSecret, profile, cb) {
    console.log('TEST ', profile)
    User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user)
    });
  }
));



    //select all data from federated credentials where provider = issuer and subject = profileid
    // db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
    //   issuer,
    //   profile.id
    // ], function(err, row) {
    //   if (err) { return cb(err); }
    //   //if no data is found
    //   if (!row) {
    //     //add this user to User table
    //     db.run('INSERT INTO users (name) VALUES (?)', [
    //       profile.displayName
    //     ], function(err) {
    //       if (err) { return cb(err); }

    //       var id = this.lastID;
    //       //insert new credentials id, issuer and profile.id



    //       db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
    //         id,
    //         issuer,
    //         profile.id
    //       ], function(err) {
    //         if (err) { return cb(err); }
    //         var user = {
    //           id: id,
    //           name: profile.displayName
    //         };
    //         return cb(null, user);
    //       });
    //     });
    //     //if the credentials already exists
    //   } else {
    //     db.get('SELECT rowid AS id, * FROM users WHERE rowid = ?', [ row.user_id ], function(err, row) {
    //       if (err) { return cb(err); }
    //       if (!row) { return cb(null, false); }
    //       return cb(null, row);
    //     });
    //   }
    // });



  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });

  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });