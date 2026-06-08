import Ticket from "../models/Ticket.js";

export const createTicket =
data =>
  Ticket.create(data);

export const getTickets =
userId =>
  Ticket.find({
    buyer:userId
  });
