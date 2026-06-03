import {
  AccessToken,
} from "livekit-server-sdk";

export const createToken =
  (
    roomName,
    userId,
    username
  ) => {
    const token =
      new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
          identity:
            userId.toString(),

          name: username,
        }
      );

    token.addGrant({
      roomJoin: true,
      room: roomName,
    });

    return token.toJwt();
  };
