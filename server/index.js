const express = require("express");
const app = express();
const { serverPort } = require("../constants");
const mongoose = require ("mongoose");
const session = require("express-session");
const passport = require ('passport');
// const routes = require ('./routes');
const bcrypt = require("bcryptjs");

require ('dotenv').config();
require ('../config/passport');
app.use (passport.initialize());

const MongoStore = require ('connect-mongo')(session);

const db = require("../database");//connection

const dbString = 'mongodb://localhost:27017/sessions';
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology:true
}
//
const connection = mongoose.createConnection(dbString, dbOptions);

 app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(bodyParser.json());


const userRouter = require("./routes/User");
const postRouter = require("./routes/Post");

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions'
});



app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //equals 1 day
  }
}))

//passport middleware

require ('../config/passport');
app.use (passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/post", postRouter);



app.get('/', (req, res, next) => {
  res.send('<a class="button" href="/login/federated/google">Sign in with Google</a>');
});

app.listen(serverPort, () => {
  console.log(`listening on port ${serverPort}`);
});
