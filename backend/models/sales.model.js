import mongoose, { Schema } from 'mongoose'

const salesSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productName: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    ProfitInPercent: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true })


salesSchema.post('save', async function (doc) {
    const inventoryItem = await Inventory.findById(doc.product); //product from frontEnd
    inventoryItem.stockRemain -= doc.qtySold;
    await inventoryItem.save();
}
);



export const Sales = mongoose.model('Sales', salesSchema) 
