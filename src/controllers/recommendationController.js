import {
  getForYouFeed
}
from "../services/recommendationService.js";

export const getRecommendations =
async (req,res,next)=>{
  try{

    const data =
      await getForYouFeed();

    res.json({
      success:true,
      data
    });

  }catch(error){
    next(error);
  }
};
