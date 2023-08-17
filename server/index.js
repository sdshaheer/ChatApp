const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./DataBase/connection");
const userRoutes = require("./Routes/userRoutes");
const fileRoutes = require("./Controllers/fileController");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/images", fileRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("server started");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setUp", (userId) => {
    socket.join(userId);
    socket.emit("connected");
    console.log("connected user Id", userId);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log("user joined room", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("newMessage", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("in new mesage socket", newMessageRecieved);
    console.log("content sending is ", newMessageRecieved.content);

    if (!chat.users) return console.log("users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      console.log("sended to", user._id);
      socket.in(user._id).emit("messageRecieved", newMessageRecieved);
    });
  });
});
