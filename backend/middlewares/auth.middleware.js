import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized request: Invalid access token");
        }

        req.user = user;
        next();
    } catch (error) {
        const message = error.message.includes("invalid signature") || error.message.includes("jwt expired")
            ? "Unauthorized request: Invalid or expired access token"
            : "Unauthorized request: " + (error.message || "Invalid access token");

        throw new ApiError(401, message);
    }
});

export { verifyJWT };
