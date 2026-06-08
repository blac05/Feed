import mongoose from "mongoose";

const ticketSchema =
new mongoose.Schema({

  event:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Event"
  },

  buyer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  price:Number,

  qrCode:String,

  status:{
    type:String,
    default:"active"
  }

},{
  timestamps:true
});

export default mongoose.model(
  "Ticket",
  ticketSchema
);
