const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const setupLobby = require("./lobby");
const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
setupLobby(io);


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

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("WARMLY SERVER running on port " + PORT);
});
