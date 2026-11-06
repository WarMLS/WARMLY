const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:3000");

socket.on("connect", () => {
  console.log("Connected to WARMLY:", socket.id);

  socket.emit("joinLobby", "Player 2");
});

socket.on("lobbyUpdate", (players) => {
  console.log("LOBBY PLAYERS:", players);
});

socket.on("matchReady", (data) => {
  console.log(data.message);
});

socket.on("lobbyError", (message) => {
  console.log("ERROR:", message);
});
