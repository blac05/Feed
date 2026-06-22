import Story from "../models/Story.js";

export const createStory = async (req, res, next) => {
  try {
    const { image, video, mediaType, text, textColor, background, caption, isHighlight, highlightTitle } = req.body;

    // Validation
    if (mediaType === "text" && !text?.trim()) {
      return res.status(400).json({ message: "Text is required for text stories" });
    }
    if (mediaType === "image" && !image) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (mediaType === "video" && !video) {
      return res.status(400).json({ message: "Video is required" });
    }

    const story = await Story.create({
      user: req.user._id,
      image: image || "",
      video: video || "",
      mediaType: mediaType || "image",
      text: text || "",
      textColor: textColor || "#ffffff",
      background: background || "#2563eb",
      caption: caption || "",
      isHighlight: isHighlight || false,
      highlightTitle: highlightTitle || "",
    });

    const populated = await Story.findById(story._id)
      .populate("user", "username name avatar isVerified accountType");

    res.status(201).json({ success: true, story: populated });
  } catch (error) {
    next(error);
  }
};

export const getStories = async (req, res, next) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
      isHighlight: false,
    })
      .populate("user", "username name avatar isVerified accountType")
      .sort({ createdAt: -1 });

    res.json({ success: true, stories });
  } catch (error) {
    next(error);
  }
};

export const getHighlights = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const highlights = await Story.find({
      user: userId,
      isHighlight: true,
    })
      .populate("user", "username name avatar isVerified accountType")
      .sort({ createdAt: -1 });

    res.json({ success: true, highlights });
  } catch (error) {
    next(error);
  }
};

export const viewStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (!story.views.includes(req.user._id)) {
      story.views.push(req.user._id);
      await story.save();
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const likeStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    const liked = story.likes.includes(req.user._id);
    if (liked) story.likes.pull(req.user._id);
    else story.likes.push(req.user._id);
    await story.save();
    res.json({ success: true, liked: !liked });
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Story.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const saveHighlight = async (req, res, next) => {
  try {
    const { storyId, highlightTitle, highlightCover } = req.body;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    story.isHighlight = true;
    story.highlightTitle = highlightTitle || "Highlight";
    story.highlightCover = highlightCover || story.image;
    story.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
    await story.save();
    res.json({ success: true, story });
  } catch (error) {
    next(error);
  }
};
