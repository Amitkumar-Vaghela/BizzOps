import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js';
import jwt, { decode } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { parseUserAgent, getClientIP } from '../utils/deviceDetection.js';

const generateAccessRefreshToken = async (userId, sessionId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Find the session and update its refresh token
        const sessionIndex = user.activeSessions.findIndex(session => session.sessionId === sessionId);
        if (sessionIndex !== -1) {
            user.activeSessions[sessionIndex].refreshToken = refreshToken;
            user.activeSessions[sessionIndex].lastActiveAt = new Date();
        }

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, businessName, phoneNo, address } = req.body;
    
    // Check required string fields
    if ([name, email, password, businessName, address].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }
    
    // Check phoneNo separately since it's a number
    if (!phoneNo) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const user = await User.create({
        name,
        email,
        password,
        businessName,
        phoneNo,
        address 
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Create new session
    const sessionId = uuidv4();
    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const deviceInfo = parseUserAgent(userAgent);

    // Generate tokens directly without session lookup
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Add session to user's active sessions
    const newSession = {
        sessionId,
        refreshToken,
        ipAddress,
        userAgent,
        deviceInfo,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        isActive: true
    };

    user.activeSessions.push(newSession);
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select("-password -activeSessions.refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .cookie('sessionId', sessionId, options)
        .json(new ApiResponse(200, { 
            user: loggedInUser, 
            accessToken, 
            refreshToken,
            sessionId 
        }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async(req,res)=>{
    const sessionId = req.cookies?.sessionId || req.header('X-Session-ID');
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                activeSessions: { sessionId: sessionId }
            }
        },
        {
            new: true
        }
    )
    
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .clearCookie('sessionId',options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRequestToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRequestToken){
        throw new ApiError(400,"Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRequestToken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(400,"Invalid Refresh Token")
        }

        // Find the session with this refresh token
        const activeSession = user.activeSessions.find(
            session => session.refreshToken === incomingRequestToken && session.isActive
        );

        if(!activeSession){
            throw new ApiError(400,"Refresh token is expired or used")
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateAccessRefreshToken(user._id, activeSession.sessionId)

        const options = {
            httpOnly:true,
            secure:true
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(200,{accessToken, refreshToken:newRefreshToken}, "AccessToken refreshed Successfully"))
    } catch (error) {
        throw new ApiError(400,error.message || "error while refreshing token")
    }
});

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:true});
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfull"))
});

const getCurrentUserDetails = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"User details fetched Successful"))
});

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {name, email, businessName, phoneNo, address} = req.body
    if(!name || !email || !businessName){
        throw new ApiError(400,"All field are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                name,
                email,
                businessName,
                phoneNo,
                address
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successful"))
})

const getActiveSessions = asyncHandler(async(req, res) => {
    console.log('=== getActiveSessions Controller ===');
    console.log('Headers received:', {
        'X-Session-ID': req.header('X-Session-ID'),
        'sessionId': req.header('sessionId'),
        'cookies.sessionId': req.cookies?.sessionId,
        'Authorization': req.header('Authorization') ? 'Present' : 'Missing'
    });
    
    const user = await User.findById(req.user._id).select("activeSessions");
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log('Total sessions in database:', user.activeSessions?.length || 0);
    console.log('Sessions data:', user.activeSessions);

    // Filter out inactive sessions and hide refresh tokens
    const currentSessionId = req.cookies?.sessionId || req.header('X-Session-ID') || req.header('sessionId');
    console.log('Resolved current sessionId:', currentSessionId);
    
    const activeSessions = user.activeSessions
        .filter(session => session.isActive)
        .map(session => ({
            sessionId: session.sessionId,
            ipAddress: session.ipAddress,
            deviceInfo: session.deviceInfo,
            createdAt: session.createdAt,
            lastActiveAt: session.lastActiveAt,
            isCurrent: session.sessionId === currentSessionId
        }));

    console.log('Filtered active sessions:', activeSessions.length);
    console.log('Active sessions details:', activeSessions);

    return res
        .status(200)
        .json(new ApiResponse(200, activeSessions, "Active sessions fetched successfully"));
});

const revokeSession = asyncHandler(async(req, res) => {
    const { sessionId } = req.params;
    const currentSessionId = req.cookies?.sessionId || req.header('X-Session-ID');

    if (sessionId === currentSessionId) {
        throw new ApiError(400, "Cannot revoke current session. Please use logout instead.");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                activeSessions: { sessionId: sessionId }
            }
        },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Session revoked successfully"));
});

const revokeAllSessions = asyncHandler(async(req, res) => {
    const currentSessionId = req.cookies?.sessionId || req.header('X-Session-ID');

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                activeSessions: { 
                    sessionId: { $ne: currentSessionId } 
                }
            }
        },
        { new: true }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All other sessions revoked successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUserDetails,
    updateAccountDetails,
    getActiveSessions,
    revokeSession,
    revokeAllSessions,
};  