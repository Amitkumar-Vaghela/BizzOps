import mongoose, { Schema } from "mongoose";

const invoiceSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  item: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  paid: {
    type: Boolean,
    required: true,
    default:false
  },
  subTotal: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true
  }
})

export const Invoice = mongoose.model('Invoice', invoiceSchema)