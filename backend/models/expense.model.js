import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema({
    expOn: {
        type: String,
        required: true,
    },
    expAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        required: true
    }
});

export const Expense = mongoose.model('Expense', expenseSchema)