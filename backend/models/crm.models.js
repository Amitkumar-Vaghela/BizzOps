import mongoose,{Schema} from "mongoose";

const crmSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const CRM = mongoose.model('CRM',crmSchema)