import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from '../models/user.model.js'
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler(async(req,res)=>{
    const {name, email, password, businessName} = req.body
    if([name,email,password,businessName].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne(
        {
            $or:[{email}]
        }
    )
    if (existedUser) {
        throw new ApiError(400,"User already exists with same email")
    }

    const user = await User.create({
        name,
        email,
        password,
        businessName
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,createdUser,"User Registered Successfully"))
})