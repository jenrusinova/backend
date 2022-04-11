const express = require("express");
const app = express();
const { serverPort } = require("../constants");
const mongoose = require ("mongoose");
const session = require("express-session");

const MongoStore = require ('connect-mongo')(session);

const db = require("../database");

const dbString = 'mongodb://localhost:27017/sessions';
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology:true
}

const connection = mongoose.createConnection(dbString, dbOptions);

app.use(express.json());

const userRouter = require("./routes/User");
const postRouter = require("./routes/Post");

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions'
});

app.use("/user", userRouter);
app.use("/post", postRouter);

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //equals 1 day
  }
}))

app.get('/', (req, res, next) => {
  res.send('sessions');
});

app.listen(serverPort, () => {
  console.log(`listening on port ${serverPort}`);
});
