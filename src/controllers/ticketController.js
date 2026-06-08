import Ticket from "../models/Ticket.js";

export const buyTicket =
async (req,res,next)=>{
  try{

    const ticket =
      await Ticket.create({

        ...req.body,

        buyer:req.user._id
      });

    res.status(201).json({
      success:true,
      ticket
    });

  }catch(error){
    next(error);
  }
};

export const myTickets =
async (req,res,next)=>{
  try{

    const tickets =
      await Ticket.find({
        buyer:req.user._id
      });

    res.json({
      success:true,
      tickets
    });

  }catch(error){
    next(error);
  }
};
