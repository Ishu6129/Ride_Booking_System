import io from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const emitRideRequest = (data) => {
  if (socket) {
    socket.emit('ride:request', data);
  }
};

export const emitDriverOnline = (data) => {
  if (socket) {
    socket.emit('driver:online', data);
  }
};

export const emitLocationUpdate = (data) => {
  if (socket) {
    socket.emit('driver:location:update', data);
  }
};

export const emitRideAccept = (data) => {
  if (socket) {
    socket.emit('ride:accept', data);
  }
};

export const emitRideStart = (data) => {
  if (socket) {
    socket.emit('ride:start', data);
  }
};

export const emitRideComplete = (data) => {
  if (socket) {
    socket.emit('ride:complete', data);
  }
};

export const emitRideCancel = (data) => {
  if (socket) {
    socket.emit('ride:cancel', data);
  }
};

export const emitPaymentCompleted = (data) => {
  if (socket) {
    socket.emit('payment:completed', data);
  }
};

export const onRideRequestConfirmed = (callback) => {
  if (socket) {
    socket.on('ride:request:confirmed', callback);
  }
};

export const onRideAccepted = (callback) => {
  if (socket) {
    socket.on('ride:accepted', callback);
  }
};

export const onDriverLocationUpdate = (callback) => {
  if (socket) {
    socket.on('driver:location:update', callback);
  }
};

export const onRideStarted = (callback) => {
  if (socket) {
    socket.on('ride:started', callback);
  }
};

export const onRideCompleted = (callback) => {
  if (socket) {
    socket.on('ride:completed', callback);
  }
};

export const onRideCancelled = (callback) => {
  if (socket) {
    socket.on('ride:cancelled', callback);
  }
};

export const onPaymentCompleted = (callback) => {
  if (socket) {
    socket.on('payment:completed', callback);
  }
};

export const offEvent = (event) => {
  if (socket) {
    socket.off(event);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
