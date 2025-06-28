// middlewares/verifyJWT.js

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const rawToken = req.cookies?.accessToken || req.header('Authorization');

    if (!rawToken) {
      throw new ApiError(401, 'Unauthorized request');
    }

    // Extract token if it includes "Bearer <token>"
    const token = rawToken.startsWith('Bearer ')
      ? rawToken.split(' ')[1]
      : rawToken;

    // Verify the token using ACCESS_TOKEN_SECRET
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user and remove sensitive fields
    const user = await User.findById(decodedToken._id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message || 'Invalid access token');
  }
});

export { verifyJWT };
