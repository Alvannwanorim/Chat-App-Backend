const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const { addUser, getUser, removeUser, getUsersInRoom } = require("./users");
const router = require("./router");

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name} welocme to ${user.room}`,
    });

    socket.broadcast
      .to(uer.room)
      .emit("message", { user: user.name, text: `${user.name} has joined!` });

    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("user disconneted");
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
