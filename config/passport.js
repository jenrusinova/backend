const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require ('../database/index.js');
const User = connection.models.User;
const validPassword = require ('../lib/passwordUtils.js').validPassword;



const customFields = {
  usernameField: 'uname',
  passwordFiels:'pw'
};



const verifyCallback = (username, password, done) => {
  //username received from request body
  User.findOne({username: username})
    .then((user) => {
      if (!user){
        return done (null, false);
      }

      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid){
        return done (null, user);
      } else {
        return done (null, false);
      }
    })
    .catch ((err) => {
      done (err);
    });

};

const strategy = new LocalStrategy(customFields, verifyCallback);


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

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((userId, done) => {
  User.findById (userId)
  .then((user) => {
    done (null, user);
  })
  .catch(err => done (err));
});