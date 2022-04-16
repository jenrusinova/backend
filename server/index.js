const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config();
const mongoose = require ("mongoose");
const session = require("express-session");
const passport = require ('passport');
// const routes = require ('./routes');
const bcrypt = require("bcryptjs");
require ('../config/passport');

const db = require("../database");

require ('../config/passport');
app.use (passport.initialize());

const MongoStore = require ('connect-mongo')(session);


const dbString = 'mongodb://localhost:27017/sessions';
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology:true
}
//
const connection = mongoose.createConnection(dbString, dbOptions);


app.use(express.json());

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

app.use("/user", userRouter);
app.use("/post", postRouter);
app.post('/random', (req, res) => {
  console.log('got random');
  res.sendStatus(200);
})

app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRouter);
app.use("/post", postRouter);

app.get('/', (req, res, next) => {
  res.send('<a class="button" href="/user/login/federated/google">Sign in with Google</a>');
});

app.get('/oauth2/redirect/google', passport.authenticate('google', {
  // successRedirect: 'exp://10.0.0.251:19000',
  successRedirect: '/success',
  failureRedirect: '/login'
}));

app.get('/login', (req, res) => {
  console.log('REQ ', req);
  res.send("FAILED")
})

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit(`${msg.sender}${msg.receiver}`, msg);
  });
});

server.listen(port, () => {
  console.log(`listening on port 3000`);
});
