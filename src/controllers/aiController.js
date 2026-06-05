import {
  generateCaption
}
from "../services/aiService.js";

export const createCaption =
async (req,res,next)=>{
  try{

    const caption =
      await generateCaption(
        req.body.text
      );

    res.json({
      success:true,
      caption
    });

  }catch(error){
    next(error);
  }
};
