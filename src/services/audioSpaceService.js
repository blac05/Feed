import AudioSpace from "../models/AudioSpace.js";

export const createSpace =
data =>
  AudioSpace.create(data);

export const getSpaces =
() =>
  AudioSpace.find()
  .populate(
    "host",
    "username avatar"
  );
