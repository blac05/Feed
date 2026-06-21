import Event from "../models/Event.js";

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .populate("host", "username name avatar isVerified accountType")
      .sort({ date: 1 });
    res.json({ success: true, events });
  } catch (error) { next(error); }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("host", "username name avatar isVerified accountType")
      .populate("rsvps", "username name avatar");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, event });
  } catch (error) { next(error); }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, host: req.user._id });
    const populated = await Event.findById(event._id)
      .populate("host", "username name avatar isVerified accountType");
    res.status(201).json({ success: true, event: populated });
  } catch (error) { next(error); }
};

export const rsvpEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const hasRsvp = event.rsvps.includes(req.user._id);
    if (hasRsvp) {
      event.rsvps.pull(req.user._id);
    } else {
      event.rsvps.push(req.user._id);
    }
    await event.save();
    res.json({ success: true, attending: !hasRsvp, attendeeCount: event.rsvps.length });
  } catch (error) { next(error); }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    if (event.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { next(error); }
};
