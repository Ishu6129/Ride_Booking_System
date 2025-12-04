// backend/socket/index.js
const { Server } = require("socket.io");
const socketManager = require("./socketManager");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Pass io to socket manager
  socketManager(io);

  console.log("🔌 Socket.IO initialized");

  return io;
};
