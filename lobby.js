const MAX_PLAYERS = 10;

function setupLobby(io) {
  const players = new Map();

  function getLobbyState() {
    const all = [...players.values()];

    return {
      players: all,
      blue: all.filter(p => p.team === "BLUE").length,
      red: all.filter(p => p.team === "RED").length
    };
  }

  function broadcastLobby() {
    io.emit("lobbyUpdate", getLobbyState());
  }

  io.on("connection", (socket) => {
    socket.on("joinLobby", (name) => {
      if (players.has(socket.id)) return;

      if (players.size >= MAX_PLAYERS) {
        socket.emit("lobbyError", "Lobby is full");
        return;
      }

      const blueCount = [...players.values()]
        .filter(p => p.team === "BLUE").length;

      const redCount = [...players.values()]
        .filter(p => p.team === "RED").length;

      const team = blueCount <= redCount && blueCount < 5
        ? "BLUE"
        : "RED";

      const player = {
        id: socket.id,
        name: String(name || "Player").slice(0, 20),
        team
      };

      players.set(socket.id, player);

      broadcastLobby();

      if (players.size === MAX_PLAYERS) {
        io.emit("matchReady", {
          message: "WARMLY 5v5 MATCH READY"
        });
      }
    });

    socket.on("disconnect", () => {
      if (players.delete(socket.id)) {
        broadcastLobby();
      }
    });
  });
}

module.exports = setupLobby;
