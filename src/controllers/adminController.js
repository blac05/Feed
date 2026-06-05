import User from "../models/User.js";

export const getUsers =
async (req,res,next)=>{
  try{

    const users =
      await User.find()
      .select(
        "-password"
      );

    res.json({
      success:true,
      users
    });

  }catch(error){
    next(error);
  }
};
