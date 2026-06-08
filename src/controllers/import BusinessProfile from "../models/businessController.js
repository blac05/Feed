import BusinessProfile from "../models/BusinessProfile.js";

export const createBusiness =
async (req,res,next)=>{
  try{

    const business =
      await BusinessProfile.create({

        ...req.body,

        owner:req.user._id
      });

    res.status(201).json({
      success:true,
      business
    });

  }catch(error){
    next(error);
  }
};

export const getBusinesses =
async (req,res,next)=>{
  try{

    const businesses =
      await BusinessProfile.find()
      .populate(
        "owner",
        "username avatar"
      );

    res.json({
      success:true,
      businesses
    });

  }catch(error){
    next(error);
  }
};
