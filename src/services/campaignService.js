import Campaign from "../models/Campaign.js";

export const createCampaign =
data => Campaign.create(data);

export const getCampaigns =
() =>
  Campaign.find()
  .populate("brand")
  .sort({
    createdAt:-1
  });

export const getCampaign =
id =>
  Campaign.findById(id)
  .populate("brand");
