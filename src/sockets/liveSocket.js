export default io => {
  io.on(
    "connection",
    socket => {
      socket.on(
        "join-live",
        roomId => {
          socket.join(roomId);
        }
      );

      socket.on(
        "send-comment",
        data => {
          io.to(
            data.roomId
          ).emit(
            "receive-comment",
            data
          );
        }
      );

      socket.on(
        "send-gift",
        data => {
          io.to(
            data.roomId
          ).emit(
            "receive-gift",
            data
          );
        }
      );

      socket.on(
        "send-like",
        data => {
          io.to(
            data.roomId
          ).emit(
            "receive-like",
            data
          );
        }
      );
    }
  );
};
