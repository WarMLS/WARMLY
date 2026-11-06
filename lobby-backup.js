const ROOM = "warmly-5v5";
const MAX_PLAYERS = 10;

function setupLobby(io) {
  const players = new Map();

  io.on("connection", (socket) => {
    socket.on("joinLobby", (name) => {
      if (players.has(socket.id)) return;

      if (players.size >= MAX_PLAYERS) {
        socket.emit("lobbyError", "Lobby is full");
        return;
      }

      const team = [...players.values()]
        .filter(p => p.team === "BLUE").length < 5
        ? "BLUE" : "RED";

      const player = {
        id: socket.id,
        name: String(name || "Player").slice(0, 20),
        team
      };

      players.set(socket.id, player);
      socket.join(ROOM);

      io.to(ROOM).emit("lobbyUpdate", [...players.values()]);

      if (players.size === MAX_PLAYERS) {
        io.to(ROOM).emit("matchReady", {
          message: "WARMLY 5v5 MATCH READY"
        });
      }
    });

    socket.on("disconnect", () => {
      if (players.delete(socket.id)) {
        io.to(ROOM).emit("lobbyUpdate", [...players.values()]);
      }
    });
  });
}

module.exports = setupLobby;
