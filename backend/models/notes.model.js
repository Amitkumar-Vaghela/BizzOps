import mongoose, {Schema} from "mongoose";

const notesSchema = new Schema({
    owner: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    remove : {
        type: Boolean,
        required : true,
        default:false
    }
},{timestamps:true})