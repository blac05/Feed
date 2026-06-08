import Brand from "../models/Brand.js";

export const createBrand =
async (req,res,next)=>{
  try{

    const brand =
      await Brand.create(
        req.body
      );

    res.status(201).json({
      success:true,
      brand
    });

  }catch(error){
    next(error);
  }
};

export const getBrands =
async (req,res,next)=>{
  try{

    const brands =
      await Brand.find()
      .populate(
        "business"
      );

    res.json({
      success:true,
      brands
    });

  }catch(error){
    next(error);
  }
};
