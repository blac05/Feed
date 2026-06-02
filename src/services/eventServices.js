import Event from "../models/Event.js";

export const createEventService =
  async (userId, data) => {
    return await Event.create({
      title: data.title,
      description: data.description,
      location: data.location,
      date: data.date,
      createdBy: userId,
    });
  };

export const getEventsService =
  async () => {
    return await Event.find()
      .populate(
        "createdBy",
        "username"
      )
      .sort({ date: 1 });
  };

export const deleteEventService =
  async (eventId, userId) => {
    const event =
      await Event.findById(eventId);

    if (!event) {
      throw new Error(
        "Event not found"
      );
    }

    if (
      event.createdBy.toString() !==
      userId
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    await Event.findByIdAndDelete(
      eventId
    );
  };