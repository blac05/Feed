import Sponsorship from "../models/Sponsorship.js";

export const createSponsorship =
data =>
  Sponsorship.create(data);

export const getSponsorships =
() =>
  Sponsorship.find()
  .populate(
    "creator brand"
  );
