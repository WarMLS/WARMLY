const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const setupLobby = require("./lobby");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
setupLobby(io);

app.get("/", (req, res) => {
  res.send("WARMLY ML5v5 SERVER ONLINE");
});

app.get("/status", (req, res) => {
  res.json({
    server: "WARMLY ML5v5",
    status: "ONLINE"
  });
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("WARMLY SERVER running on port 3000");
});
