import Report from "../models/Report.js";

export const createReport =
async (req,res,next)=>{
  try{

    const report =
      await Report.create({

        reporter:req.user._id,

        targetId:req.body.targetId,

        targetType:req.body.targetType,

        reason:req.body.reason
      });

    res.status(201).json({
      success:true,
      report
    });

  }catch(error){
    next(error);
  }
};

export const getReports =
async (req,res,next)=>{
  try{

    const reports =
      await Report.find()
      .populate(
        "reporter",
        "username avatar"
      );

    res.json({
      success:true,
      reports
    });

  }catch(error){
    next(error);
  }
};

export const updateReport =
async (req,res,next)=>{
  try{

    const report =
      await Report.findByIdAndUpdate(
        req.params.id,
        {
          status:req.body.status
        },
        {
          new:true
        }
      );

    res.json({
      success:true,
      report
    });

  }catch(error){
    next(error);
  }
};
