const express = require("express");
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config();

const db = require("../database");

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

//passport middleware

require ('../config/passport');
app.use (passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/post", postRouter);

app.get('/', (req, res, next) => {
  res.send('<a class="button" href="/user/login/federated/google">Sign in with Google</a>');
});


app.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/test',
  failureRedirect: '/login'
}));

//app.listen(serverPort, () => {
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit(`${msg.sender}${msg.receiver}`, msg);
  });
});

server.listen(port, () => {
  console.log(`listening on port 3000`);
});
