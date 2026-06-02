import { getIO } from "./socketServer.js";

export const emitNotification =
  (
    userId,
    notification
  ) => {
    const io = getIO();

    io.to(userId).emit(
      "notification",
      notification
    );
  };