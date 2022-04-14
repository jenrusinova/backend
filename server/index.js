const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
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
<<<<<<< HEAD
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

=======
  res.send('sessions');
});


io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit(`${msg.sender}${msg.receiver}`, msg);
  });
});

>>>>>>> 77d11b13cdd8ff9239bf8684d393023815cf0ac6
server.listen(serverPort, () => {
  console.log(`listening on port ${serverPort}`);
});
