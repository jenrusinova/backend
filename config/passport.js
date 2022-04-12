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
        return cb (null, false);
      }

  console.log('user', user);
  console.log('password from db', user.password);
  bcrypt.compare(password, user.password, (err, res) => {
    if (err) {
      console.error(err);
      console.log('login is not valid');
      return cb (null, false);
    }
    else {
      console.log('login is valid');
      return cb(null, user);
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

// const verifyCallback = (username, password, done) => {
//   //username received from request body
//   console.log('passport line 18');
//

//       const isValid = validPassword(password, user.password);

//       if (isValid){
//         console.log('login is valid');
//         return done (null, user);
//       } else {
//         console.log('login is not valid');
//         return done (null, false);
//       }
//     })
//     .catch ((err) => {
//       done (err);
//     });

// };

//const strategy = new LocalStrategy(customFields, verifyCallback);


// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

// passport.use(strategy);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// })

// passport.deserializeUser((userId, done) => {
//   User.findById (userId)
//   .then((user) => {
//     done (null, user);
//   })
//   .catch(err => done (err));
// });