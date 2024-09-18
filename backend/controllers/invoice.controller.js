import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Invoice } from "../models/invoice.model.js";

const addInvoice = asyncHandler(async(req,res)=>{
    const {name, item, qty, price, total, tax, paid} = req.body
    const owner = req.user?._id
    if(!name || !item || !qty || !price || !tax || !paid){
        throw new ApiError(200,"All fields are required")
    }
    if(!owner){
        throw new ApiError(200,"Unauthorized request")
    }

    const subTotal = (qty*price)
    const grandTotal = (qty*price)*(1+(tax/100))

    const invoice = await Invoice.create({
        owner,
        name,
        item,
        qty,
        price,
        tax,
        paid,
        subTotal,
        grandTotal
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{invoice},"Invoice added successfully"))
})



export {
    addInvoice,
}