import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/orders.model.js";

const addOrder = asyncHandler(async(req,res)=>{
    const {item,qty,price,dateToDilivery,profitInPercent} = req.body
    const owner = req.user?._id
    if(!item || !qty || !price || !dateToDilivery || !profitInPercent){
        throw new ApiError(400,"All fields are required")
    }
    if(!owner){
        throw new ApiError(400,"Unauthorized request")
    }

    const totalSale = (price * qty);
    const totalProfit = (totalSale * profitInPercent) / 100;
    const totalCost = totalSale - totalProfit;

    const order = await Order.create({
        owner,
        item,
        qty,
        price,
        profitInPercent,
        dateToDilivery,
        sale:totalSale,
        profit:totalProfit,
        cost:totalCost        
    })
})

const getOrders = asyncHandler(async(req,res)=>{
    const ownerId = req.user?._id
    if(!ownerId){
        throw new ApiError(400,"Unauthorized Request")
    }

    const orders = await Order.find({ownerId})
    if(!orders){
        throw new ApiError(400,"Error while fetching orders")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,orders,"Orders retrived successfully"))
})

const getPendingOrder = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id;
    if (!ownerId) {
        throw new ApiError(400, "Unauthorized Request");
    }
    const pendingCount = await Order.countDocuments({ owner: ownerId, done: false });
    
    return res
        .status(200)
        .json(new ApiResponse(200, { pendingCount }, "Pending orders counted successfully"));
});

export {
    addOrder,
    getOrders,
    getPendingOrder
}
