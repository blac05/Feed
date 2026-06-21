import Community from "../models/Community.js";

export const getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find()
      .populate("creator", "username name avatar")
      .sort({ createdAt: -1 });
    res.json({ success: true, communities });
  } catch (error) { next(error); }
};

export const getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("creator", "username name avatar isVerified accountType")
      .populate("members", "username name avatar isVerified accountType");
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.json({ success: true, community });
  } catch (error) { next(error); }
};

export const createCommunity = async (req, res, next) => {
  try {
    const { name, description, category, image, isPrivate, rules } = req.body;
    const community = await Community.create({
      name, description, category, image, isPrivate,
      rules: rules || [],
      creator: req.user._id,
      members: [req.user._id],
      moderators: [req.user._id],
    });
    const populated = await Community.findById(community._id)
      .populate("creator", "username name avatar");
    res.status(201).json({ success: true, community: populated });
  } catch (error) { next(error); }
};

export const joinCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });
    const isMember = community.members.includes(req.user._id);
    if (isMember) {
      community.members.pull(req.user._id);
    } else {
      community.members.push(req.user._id);
    }
    await community.save();
    res.json({ success: true, joined: !isMember, memberCount: community.members.length });
  } catch (error) { next(error); }
};

export const deleteCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Not found" });
    if (community.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Community.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { next(error); }
};
