import Subscription from "../models/Subscription.js";

export const subscribe =
  data =>
    Subscription.create(data);

export const getSubscriptions =
  userId =>
    Subscription.find({
      subscriber: userId,
    }).populate(
      "creator",
      "username avatar"
    );
