import {
  moderateText
}
from "../services/moderationService.js";

export const checkContent =
(req,res)=>{

  const flagged =
    moderateText(
      req.body.text
    );

  res.json({
    success:true,
    flagged
  });
};
