import VideoCall from "../models/VideoCall.js";

export const createCall =
async (req,res,next)=>{
  try{

    const call =
      await VideoCall.create({

        host:req.user._id,

        roomId:req.body.roomId
      });

    res.status(201).json({
      success:true,
      call
    });

  }catch(error){
    next(error);
  }
};

export const getCalls =
async (req,res,next)=>{
  try{

    const calls =
      await VideoCall.find();

    res.json({
      success:true,
      calls
    });

  }catch(error){
    next(error);
  }
};
