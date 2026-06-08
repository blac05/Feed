import Advertisement from "../models/Advertisement.js";

export const createAdvertisement =
async (req,res,next)=>{
  try{

    const ad =
      await Advertisement.create(
        req.body
      );

    res.status(201).json({
      success:true,
      ad
    });

  }catch(error){
    next(error);
  }
};

export const getAdvertisements =
async (req,res,next)=>{
  try{

    const ads =
      await Advertisement.find()
      .populate(
        "campaign"
      );

    res.json({
      success:true,
      ads
    });

  }catch(error){
    next(error);
  }
};
