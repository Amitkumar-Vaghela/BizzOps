import { User } from '../models/user.model.js';

// Clean up expired sessions (sessions older than 30 days)
export const cleanupExpiredSessions = async () => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        await User.updateMany(
            {},
            {
                $pull: {
                    activeSessions: {
                        lastActiveAt: { $lt: thirtyDaysAgo }
                    }
                }
            }
        );
        
    } catch (error) {
        console.error('Error cleaning up expired sessions:', error);
    }
};

// Mark sessions as inactive instead of deleting them immediately
export const markInactiveSessions = async () => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        await User.updateMany(
            { "activeSessions.lastActiveAt": { $lt: sevenDaysAgo } },
            {
                $set: {
                    "activeSessions.$[session].isActive": false
                }
            },
            {
                arrayFilters: [
                    { "session.lastActiveAt": { $lt: sevenDaysAgo } }
                ]
            }
        );
        
    } catch (error) {
        console.error('Error marking inactive sessions:', error);
    }
};

// Revoke sessions from other devices (keep current session)
export const revokeOtherDeviceSessions = async (userId, currentSessionId) => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "activeSessions.$[session].isActive": false
                }
            },
            {
                arrayFilters: [
                    { 
                        "session.sessionId": { $ne: currentSessionId },
                        "session.isActive": true
                    }
                ],
                new: true
            }
        );
        
        if (result) {
            const remainingSessions = result.activeSessions.filter(session => session.isActive);
            return {
                success: true,
                remainingSessions: remainingSessions.length,
                message: 'Other device sessions revoked successfully'
            };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Revoke all sessions for a user (including current session)
export const revokeAllUserSessions = async (userId) => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "activeSessions.$[].isActive": false
                }
            },
            { new: true }
        );
        
        if (result) {
            return {
                success: true,
                message: 'All sessions revoked successfully'
            };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Revoke a specific session
export const revokeSpecificSession = async (userId, sessionId) => {
    try {
        const result = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "activeSessions.$[session].isActive": false
                }
            },
            {
                arrayFilters: [
                    { "session.sessionId": sessionId }
                ],
                new: true
            }
        );
        
        if (result) {
            return {
                success: true,
                message: 'Session revoked successfully'
            };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Get session statistics for monitoring
export const getSessionStatistics = async () => {
    try {
        const pipeline = [
            { $unwind: "$activeSessions" },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    activeSessions: {
                        $sum: {
                            $cond: [{ $eq: ["$activeSessions.isActive", true] }, 1, 0]
                        }
                    },
                    inactiveSessions: {
                        $sum: {
                            $cond: [{ $eq: ["$activeSessions.isActive", false] }, 1, 0]
                        }
                    },
                    uniqueUsers: { $addToSet: "$_id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSessions: 1,
                    activeSessions: 1,
                    inactiveSessions: 1,
                    uniqueUsersWithSessions: { $size: "$uniqueUsers" }
                }
            }
        ];

        const result = await User.aggregate(pipeline);
        
        return result[0] || {
            totalSessions: 0,
            activeSessions: 0,
            inactiveSessions: 0,
            uniqueUsersWithSessions: 0
        };
    } catch (error) {
        console.error('Error getting session statistics:', error);
        return {
            error: error.message
        };
    }
};

// Bulk cleanup function that runs all cleanup operations
export const performSessionMaintenance = async () => {
    try {
        await cleanupExpiredSessions();
        await markInactiveSessions();
        
        const stats = await getSessionStatistics();
        
        return {
            success: true,
            statistics: stats
        };
    } catch (error) {
        console.error('Error during session maintenance:', error);
        return {
            success: false,
            error: error.message
        };
    }
};