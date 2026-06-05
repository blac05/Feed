import mongoose from "mongoose";

const platformSettingsSchema =
new mongoose.Schema({

  maintenanceMode:{
    type:Boolean,
    default:false
  },

  registrationEnabled:{
    type:Boolean,
    default:true
  },

  minimumWithdrawal:{
    type:Number,
    default:10
  },

  platformFee:{
    type:Number,
    default:10
  },

  supportEmail:String

},{
  timestamps:true
});

export default mongoose.model(
  "PlatformSettings",
  platformSettingsSchema
);
