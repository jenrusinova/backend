const express = require("express");
const app = express();
const { serverPort } = require("../constants");

const db = require("../database");

app.use(express.json());

const userRouter = require("./routes/User");
const postRouter = require("./routes/Post");

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(serverPort, () => {
  console.log(`listening on port ${serverPort}`);
});
