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

app.use("/user", userRouter);
app.use("/post", postRouter);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit(`${msg.sender}${msg.receiver}`, msg);
  });
});

server.listen(port, () => {
  console.log(`listening on port 3000`);
});
