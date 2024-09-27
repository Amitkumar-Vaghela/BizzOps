import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/notes.model.js";

const addNote = asyncHandler(async(req,res)=>{
    const { title, content} = req.body
    const owner = req.user?._id
    if(!title || !content){
        throw new ApiError(400,"All fields are required")
    }
    if(!owner){
        throw new ApiError(400,"Unauthorized request")
    }

    const note = Note.create({
        owner,
        title,
        content
    })

    return res
    .status(200)
    .json(new ApiResponse(200,note,"Note created successfully"))
})

const getNote = asyncHandler(async(req,res)=>{
    const ownerId = req.user?._id
    if(!ownerId){
        throw new ApiError(400,"Unauthorized request")
    }

    const notes = await Note.find({ownerId})

    return res
    .status(200)
    .json(new ApiResponse(200, { notes }, "Notes retrieved successfully"));
})

export {
    addNote,
    getNote
}