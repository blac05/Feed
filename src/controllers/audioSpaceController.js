import AudioSpace from "../models/AudioSpace.js";
import { getIO } from "../sockets/socketServer.js";
import crypto from "crypto";

export const createSpace = async (req, res, next) => {
  try {
    const { title, description, topic, scheduledFor } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const roomId = `space_${req.user._id}_${crypto.randomBytes(4).toString("hex")}`;

    const space = await AudioSpace.create({
      host: req.user._id,
      title,
      description: description || "",
      topic: topic || "Other",
      roomId,
      isLive: !scheduledFor,
      scheduledFor: scheduledFor || null,
      speakers: [{ user: req.user._id, isMuted: false }],
    });

    const populated = await AudioSpace.findById(space._id)
      .populate("host", "username name avatar isVerified accountType")
      .populate("speakers.user", "username name avatar isVerified");

    res.status(201).json({ success: true, space: populated });
  } catch (error) { next(error); }
};

export const getSpaces = async (req, res, next) => {
  try {
    const spaces = await AudioSpace.find({ isLive: true })
      .populate("host", "username name avatar isVerified accountType")
      .populate("speakers.user", "username name avatar isVerified")
      .sort({ createdAt: -1 });
    res.json({ success: true, spaces });
  } catch (error) { next(error); }
};

export const getSpace = async (req, res, next) => {
  try {
    const space = await AudioSpace.findById(req.params.id)
      .populate("host", "username name avatar isVerified accountType")
      .populate("speakers.user", "username name avatar isVerified")
      .populate("listeners", "username name avatar")
      .populate("raisedHands", "username name avatar");
    if (!space) return res.status(404).json({ message: "Space not found" });
    res.json({ success: true, space });
  } catch (error) { next(error); }
};

export const joinSpace = async (req, res, next) => {
  try {
    const space = await AudioSpace.findById(req.params.id);
    if (!space || !space.isLive) return res.status(404).json({ message: "Space not found or ended" });

    if (!space.listeners.includes(req.user._id)) {
      space.listeners.push(req.user._id);
      if (space.listeners.length > space.peakListeners) {
        space.peakListeners = space.listeners.length;
      }
      await space.save();
    }

    try {
      const io = getIO();
      io.to(space.roomId).emit("space-listener-joined", {
        userId: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
        listenerCount: space.listeners.length,
      });
    } catch (e) {}

    res.json({ success: true, roomId: space.roomId });
  } catch (error) { next(error); }
};

export const endSpace = async (req, res, next) => {
  try {
    const space = await AudioSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Not found" });
    if (space.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    space.isLive = false;
    space.endedAt = new Date();
    await space.save();

    try {
      const io = getIO();
      io.to(space.roomId).emit("space-ended", { message: "Space has ended" });
    } catch (e) {}

    res.json({ success: true });
  } catch (error) { next(error); }
};

export const raiseHand = async (req, res, next) => {
  try {
    const space = await AudioSpace.findById(req.params.id);
    if (!space || !space.isLive) return res.status(404).json({ message: "Space not found" });

    const hasHand = space.raisedHands.includes(req.user._id);
    if (hasHand) {
      space.raisedHands.pull(req.user._id);
    } else {
      space.raisedHands.push(req.user._id);
    }
    await space.save();

    try {
      const io = getIO();
      io.to(space.roomId).emit("space-hand-raised", {
        userId: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
        raised: !hasHand,
      });
    } catch (e) {}

    res.json({ success: true, raised: !hasHand });
  } catch (error) { next(error); }
};

export const inviteSpeaker = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const space = await AudioSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Not found" });
    if (space.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the host can invite speakers" });
    }

    const alreadySpeaker = space.speakers.some(s => s.user.toString() === userId);
    if (!alreadySpeaker) {
      space.speakers.push({ user: userId, isMuted: false });
      space.raisedHands.pull(userId);
      await space.save();
    }

    try {
      const io = getIO();
      io.to(userId).emit("space-speaker-invited", { spaceId: space._id, roomId: space.roomId });
      io.to(space.roomId).emit("space-speaker-added", { userId });
    } catch (e) {}

    res.json({ success: true });
  } catch (error) { next(error); }
};
