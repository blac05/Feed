import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// ── Shared stream uploader ─────────────────────────────────
const streamUpload = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ── Image ──────────────────────────────────────────────────
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const result = await streamUpload(req.file.buffer, {
      folder: "feed",
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ── Avatar ─────────────────────────────────────────────────
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const result = await streamUpload(req.file.buffer, {
      folder: "feed/avatars",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ── Video ──────────────────────────────────────────────────
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    // File size guard — 100MB
    if (req.file.size > 100 * 1024 * 1024) {
      return res.status(400).json({ message: "Video must be under 100MB" });
    }

    const result = await streamUpload(req.file.buffer, {
      folder: "feed/videos",
      resource_type: "video",
      transformation: [{ quality: "auto" }],
    });
    res.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ message: "Video upload failed" });
  }
};

// ── Story media (image or video) ───────────────────────────
export const uploadStoryMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const isVideo = req.file.mimetype.startsWith("video/");
    const result = await streamUpload(req.file.buffer, {
      folder: "feed/stories",
      resource_type: isVideo ? "video" : "image",
      transformation: isVideo
        ? [{ quality: "auto" }]
        : [{ width: 1080, height: 1920, crop: "fill" }, { quality: "auto" }],
    });
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      type: isVideo ? "video" : "image",
    });
  } catch (error) {
    res.status(500).json({ message: "Story upload failed" });
  }
};
