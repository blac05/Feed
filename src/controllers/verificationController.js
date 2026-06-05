import VerificationRequest
from "../models/VerificationRequest.js";

export const submitVerification =
async (req,res,next)=>{
  try{

    const request =
      await VerificationRequest.create({

        user:req.user._id,

        fullName:req.body.fullName,

        documentUrl:
          req.body.documentUrl
      });

    res.status(201).json({
      success:true,
      request
    });

  }catch(error){
    next(error);
  }
};

export const getVerificationRequests =
async (req,res,next)=>{
  try{

    const requests =
      await VerificationRequest.find()
      .populate(
        "user",
        "username avatar email"
      );

    res.json({
      success:true,
      requests
    });

  }catch(error){
    next(error);
  }
};

export const approveVerification =
async (req,res,next)=>{
  try{

    const request =
      await VerificationRequest.findByIdAndUpdate(
        req.params.id,
        {
          status:"approved"
        },
        {
          new:true
        }
      );

    res.json({
      success:true,
      request
    });

  }catch(error){
    next(error);
  }
};
