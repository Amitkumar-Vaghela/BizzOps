import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { Staff } from '../models/staff.model.js'

const addStaff = asyncHandler(async(req,res)=>{
    const {name,salary,debitCreditHistory} = req.body
    const owner = req.user?._id
    if(!name || !salary || !debitCreditHistory){
        throw new ApiError(400,"All fields are required")
    }
    if(!owner){
        throw new ApiError(400,"Unauthorized request")
    }
    const staff = await Staff.create({
        owner,
        name,
        salary,
        debitCreditHistory
    })
    if(!staff){
        throw new ApiError(400,"somthing went wrong while creating staff")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{staff},"Staff created successfully"))
})

const getStaff = asyncHandler(async(req,res)=>{
    const owner = req.user?._id
    if(!owner){
        throw new ApiError(400,"Unauthorized request")
    }

    const staff = await Staff.find({owner})
    if(!staff){
        throw new ApiError(400,"somthing went wrong while fetching staff")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{staff},"Staff retrived successfully"))
})

const staffCredit = asyncHandler(async(req,res)=>{
    let {staff, amount} = req.body
    const owner = req.user?._id
    if(!staff || !amount){
        throw new ApiError(400,"All fields are required")
    }
    if(!owner){
        throw new ApiResponse(400,"Unauthorized request")
    }

    const credit = await Staff.findOne({_id:staff, owner})
    if(!credit){
        throw new ApiResponse(400,"Staff not found")
    }

    credit.debitCreditHistory += amount
    await credit.save()

    return res
    .status(200)
    .json(new ApiResponse(200,{credit},"Amount added successfully"))
})

const staffDebit = asyncHandler(async(req,res)=>{
    let {staff, amount} = req.body
    const owner = req.user?._id
    if(!staff || !amount){
        throw new ApiError(400,"All fields are required")
    }
    if(!owner){
        throw new ApiResponse(400,"Unauthorized request")
    }

    const debit = await Staff.findOne({_id:staff, owner})
    if(!debit){
        throw new ApiResponse(400,"Staff not found")
    }

    debit.debitCreditHistory -= amount
    await debit.save()

    return res
    .status(200)
    .json(new ApiResponse(200,{debit},"Amount added successfully"))
})

export {
    addStaff,
    getStaff,
    staffCredit,
    staffDebit
}