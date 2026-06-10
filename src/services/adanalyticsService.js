import AdAnalytics from "../models/AdAnalytics.js";

export const getAnalytics =
async ()=>{

  const analytics =
    await AdAnalytics.find()
    .populate(
      "advertisement"
    );

  return analytics;
};
