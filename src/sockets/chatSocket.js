// chatSocket.js
export default function chatSocket(io) {
  console.log('A user connected');

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-chat', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('send-message', (data) => {
      // data should include roomId and message content
      io.to(data.roomId).emit('receive-message', data);
    });
  });
}