import Sponsorship from "../models/Sponsorship.js";

export const createSponsorship =
async (req,res,next)=>{
  try{

    const sponsorship =
      await Sponsorship.create(
        req.body
      );

    res.status(201).json({
      success:true,
      sponsorship
    });

  }catch(error){
    next(error);
  }
};

export const getSponsorships =
async (req,res,next)=>{
  try{

    const sponsorships =
      await Sponsorship.find()
      .populate(
        "creator brand"
      );

    res.json({
      success:true,
      sponsorships
    });

  }catch(error){
    next(error);
  }
};
