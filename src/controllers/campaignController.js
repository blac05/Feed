import Campaign from "../models/Campaign.js";

export const createCampaign =
async (req,res,next)=>{
  try{

    const campaign =
      await Campaign.create(
        req.body
      );

    res.status(201).json({
      success:true,
      campaign
    });

  }catch(error){
    next(error);
  }
};

export const getCampaigns =
async (req,res,next)=>{
  try{

    const campaigns =
      await Campaign.find()
      .populate("brand");

    res.json({
      success:true,
      campaigns
    });

  }catch(error){
    next(error);
  }
};
