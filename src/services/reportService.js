import Report from "../models/Report.js";

export const createReport =
data => Report.create(data);

export const getReports =
() =>
  Report.find()
    .populate(
      "reporter",
      "username avatar"
    )
    .sort({
      createdAt:-1
    });

export const updateReportStatus =
(id,status)=>
  Report.findByIdAndUpdate(
    id,
    { status },
    { new:true }
  );
