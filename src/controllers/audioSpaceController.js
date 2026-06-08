import AudioSpace from "../models/AudioSpace.js";

export const createSpace =
async (req,res,next)=>{
  try{

    const space =
      await AudioSpace.create({

        ...req.body,

        host:req.user._id
      });

    res.status(201).json({
      success:true,
      space
    });

  }catch(error){
    next(error);
  }
};

export const getSpaces =
async (req,res,next)=>{
  try{

    const spaces =
      await AudioSpace.find();

    res.json({
      success:true,
      spaces
    });

  }catch(error){
    next(error);
  }
};
