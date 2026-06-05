import User from "../models/User.js";
import Report from "../models/Report.js";
import VerificationRequest from "../models/VerificationRequest.js";

export const getDashboardStats =
async ()=>{

  const users =
    await User.countDocuments();

  const reports =
    await Report.countDocuments();

  const verifications =
    await VerificationRequest.countDocuments({
      status:"pending"
    });

  return {
    users,
    reports,
    verifications
  };
};
