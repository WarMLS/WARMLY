const { io } = require("socket.io-client");

for (let i = 1; i <= 10; i++) {
  const socket = io("http://127.0.0.1:3000");

  socket.on("connect", () => {
    console.log("Connected:", "Player " + i, socket.id);
    socket.emit("joinLobby", "Player " + i);
  });

  socket.on("lobbyUpdate", (players) => {
    console.log("LOBBY:", players.length, "/ 10");
    console.log(players);
  });

  socket.on("teamCount", (count) => {
    console.log("BLUE:", count.blue, "/ 5");
    console.log("RED:", count.red, "/ 5");
  });
  socket.on("matchReady", (data) => {
    console.log(data.message);
  });

  socket.on("lobbyError", (message) => {
    console.log("ERROR:", message);
  });
}
