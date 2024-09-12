import mongoose,{Schema} from "mongoose";

const invoiceSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    default: ""
  },
  fileURL: {
    type: String,
    required: true,
  },
});

export const Invoice = mongoose.model('Invoice',invoiceSchema)