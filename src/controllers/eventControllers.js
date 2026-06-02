import {
  createEventService,
  getEventsService,
  deleteEventService,
} from "../services/eventService.js";

export const createEvent = async (
  req,
  res,
  next
) => {
  try {
    const event =
      await createEventService(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req,
  res,
  next
) => {
  try {
    const events =
      await getEventsService();

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent =
  async (req, res, next) => {
    try {
      await deleteEventService(
        req.params.id,
        req.user._id.toString()
      );

      res.json({
        success: true,
        message:
          "Event deleted",
      });
    } catch (error) {
      next(error);
    }
  };