import Order from "../models/Order.js";

export const createOrder =
  data => Order.create(data);

export const getOrders =
  userId =>
    Order.find({
      buyer: userId,
    })
      .populate("product")
      .sort({
        createdAt: -1,
      });
