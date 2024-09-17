import mongoose, { Schema } from 'mongoose';


const inventorySchema = new Schema({
    item: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stockRemain: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const Inventory = mongoose.model('Inventory', inventorySchema);
