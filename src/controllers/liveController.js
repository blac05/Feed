import LiveStream from "../models/LiveStream.js";
import { getIO } from "../sockets/socketServer.js";

export const startLive = async (req, res, next) => {
  try {
    // End any existing live stream from this user
    await LiveStream.updateMany(
      { host: req.user._id, isLive: true },
      { isLive: false, endedAt: new Date() }
    );

    const roomName = `live_${req.user._id}_${Date.now()}`;
    const stream = await LiveStream.create({
      host: req.user._id,
      title: req.body.title || "Live Stream",
      description: req.body.description || "",
      category: req.body.category || "Just Chatting",
      tags: req.body.tags || [],
      roomName,
      isLive: true,
    });

    const populated = await LiveStream.findById(stream._id)
      .populate("host", "username name avatar isVerified accountType");

    res.status(201).json({ success: true, stream: populated, roomName });
  } catch (error) {
    next(error);
  }
};

export const joinLive = async (req, res, next) => {
  try {
    const stream = await LiveStream.findById(req.params.id)
      .populate("host", "username name avatar isVerified accountType");
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    if (!stream.isLive) return res.status(400).json({ message: "Stream has ended" });

    // Add viewer
    if (!stream.viewers.includes(req.user._id)) {
      stream.viewers.push(req.user._id);
      stream.viewerCount = stream.viewers.length;
      if (stream.viewerCount > stream.peakViewers) {
        stream.peakViewers = stream.viewerCount;
      }
      await stream.save();
    }

    // Notify room of new viewer count
    try {
      const io = getIO();
      io.to(stream.roomName).emit("viewer-count", { count: stream.viewerCount });
    } catch (e) {}

    res.json({ success: true, stream, roomName: stream.roomName });
  } catch (error) {
    next(error);
  }
};

export const getLives = async (req, res, next) => {
  try {
    const streams = await LiveStream.find({ isLive: true })
      .populate("host", "username name avatar isVerified accountType")
      .sort({ viewerCount: -1, createdAt: -1 });
    res.json({ success: true, streams });
  } catch (error) {
    next(error);
  }
};

export const getLive = async (req, res, next) => {
  try {
    const stream = await LiveStream.findById(req.params.id)
      .populate("host", "username name avatar isVerified accountType");
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    res.json({ success: true, stream });
  } catch (error) {
    next(error);
  }
};

export const endLive = async (req, res, next) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    if (stream.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    stream.isLive = false;
    stream.endedAt = new Date();
    await stream.save();

    try {
      const io = getIO();
      io.to(stream.roomName).emit("stream-ended", { message: "Stream has ended" });
    } catch (e) {}

    res.json({ success: true, message: "Live ended" });
  } catch (error) {
    next(error);
  }
};

export const leaveStream = async (req, res, next) => {
  try {
    const stream = await LiveStream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: "Stream not found" });

    stream.viewers = stream.viewers.filter(v => v.toString() !== req.user._id.toString());
    stream.viewerCount = stream.viewers.length;
    await stream.save();

    try {
      const io = getIO();
      io.to(stream.roomName).emit("viewer-count", { count: stream.viewerCount });
    } catch (e) {}

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

