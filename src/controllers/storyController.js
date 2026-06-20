import Story from "../models/Story.js";

export const createStory = async (req, res, next) => {
  try {
    const story = await Story.create({
      user: req.user._id,
      image: req.body.image,
      caption: req.body.caption || "",
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
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate("user", "username name avatar isVerified accountType")
      .sort({ createdAt: -1 });
    res.json({ success: true, stories });
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

