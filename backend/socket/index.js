// backend/socket/index.js
const { Server } = require('socket.io');
const socketManager = require('./socketManager');

module.exports = function setupSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // in production restrict origin
      methods: ['GET', 'POST']
    },
    pingTimeout: 20000
  });

  // initialize socket manager (pass io)
  socketManager(io);

  console.log('Socket.IO server initialized');
  return io;
};
