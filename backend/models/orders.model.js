import mongoose, {Schema} from 'mongoose'

const orderSchema = new Schema({
    owner : {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    item: {
        type : String,
        required: true
    },
    qty: {
        type: Number,
        required
    },
    price : {
        type : Number,
        required: true
    },
    dateToDilivery :{
        type: Date,
        required: true
    },
    profit:{
        type:Number,
        required:true
    },
    cost:{
        type:Number,
        required:true
    },
    profitInPercent: {
        type: Number,
        required: true
    },
},{timestamps:true})

export const Order = mongoose.model('Order',orderSchema)