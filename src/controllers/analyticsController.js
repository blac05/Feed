import {
  getPlatformStats
}
from "../services/analyticsService.js";

export const platformStats =
async (req,res,next)=>{
  try{

    const stats =
      await getPlatformStats();

    res.json({
      success:true,
      stats
    });

  }catch(error){
    next(error);
  }
};
