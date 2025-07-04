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
    const sessionId = req.cookies?.sessionId || req.header('X-Session-ID') || req.header('sessionId');

    // Debug logging
    console.log('=== Auth Middleware Debug ===');
    console.log('All headers:', JSON.stringify(req.headers, null, 2));
    console.log('Auth middleware - Headers:', {
      'X-Session-ID': req.header('X-Session-ID'),
      'sessionId': req.header('sessionId'),
      'cookies.sessionId': req.cookies?.sessionId,
      'Authorization': req.header('Authorization') ? 'Present' : 'Missing'
    });
    console.log('============================');

    if (!rawToken) {
      throw new ApiError(401, 'Unauthorized request');
    }

    // Extract token if it includes "Bearer <token>"
    const token = rawToken.startsWith('Bearer ')
      ? rawToken.split(' ')[1]
      : rawToken;

    // Verify the token using ACCESS_TOKEN_SECRET
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user and check active session
    const user = await User.findById(decodedToken._id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    // Debug logging
    console.log('Auth middleware - sessionId:', sessionId);
    console.log('Auth middleware - total sessions:', user.activeSessions?.length || 0);

    // Verify session exists and is active
    if (sessionId) {
      const activeSession = user.activeSessions.find(
        session => session.sessionId === sessionId && session.isActive
      );

      if (!activeSession) {
        console.log('Session not found or inactive:', sessionId);
        throw new ApiError(401, 'Session expired or invalid');
      }

      // Update last active time
      activeSession.lastActiveAt = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      console.log('No sessionId provided in request');
    }

    // Remove sensitive session data
    user.activeSessions = user.activeSessions.map(session => ({
      ...session.toObject(),
      refreshToken: undefined
    }));

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, error?.message || 'Invalid access token');
  }
});

export { verifyJWT };
