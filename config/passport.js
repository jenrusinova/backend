const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require ('../database/index.js');
const User = require('../database/models/User.js');
const validPassword = require ('../lib/passwordUtils.js').validPassword;
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
