const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Simulated chat data
let messages = [
  "Message 50",
  "Message 49",
  //... (up to "Message 1")
];

// Function to retrieve a subset of messages
function getMessages(offset, limit) {
  return messages.slice(offset, offset + limit);
}

io.on("connection", (socket) => {
  console.log("A user connected");

  // Emitting initial set of messages
  const initialMessages = getMessages(0, 10).reverse();
  socket.emit("init messages", initialMessages);

  socket.on("get older messages", (offset) => {
    const olderMessages = getMessages(offset, 10).reverse();
    socket.emit("older messages", olderMessages);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log(msg)
    messages.push(msg);
    io.emit("chat message", msg);
  });
});

http.listen(3001, () => {
  console.log("Server is running on port 3001");
});
