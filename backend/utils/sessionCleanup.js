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

// Mark sessions as inactive instead of deleting them immediately (7 days)
export const markInactiveSessions = async () => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        // Remove sessions older than 7 days
        await User.updateMany(
            {},
            {
                $pull: {
                    activeSessions: {
                        lastActiveAt: { $lt: sevenDaysAgo }
                    }
                }
            }
        );
        
    } catch (error) {
        console.error('Error removing old sessions:', error);
    }
};

// Revoke sessions from other devices (keep current session)
export const revokeOtherDeviceSessions = async (userId, currentSessionId) => {
    try {
        // First check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Remove all sessions except the current one
        const result = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    activeSessions: { 
                        sessionId: { $ne: currentSessionId }
                    }
                }
            },
            { new: true }
        );
        
        if (result) {
            const remainingSessions = result.activeSessions.length;
            return {
                success: true,
                remainingSessions: remainingSessions,
                message: 'Other device sessions revoked successfully'
            };
        } else {
            throw new Error('Failed to revoke sessions');
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
        // First check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Remove all active sessions
        const result = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    activeSessions: []
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
            throw new Error('Failed to revoke all sessions');
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
        // First check if the user exists and has the session
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if the session exists
        const sessionExists = user.activeSessions.some(session => session.sessionId === sessionId);
        if (!sessionExists) {
            throw new Error('Session not found');
        }

        // Remove the specific session from the array
        const result = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    activeSessions: { sessionId: sessionId }
                }
            },
            { new: true }
        );
        
        if (result) {
            return {
                success: true,
                message: 'Session revoked successfully'
            };
        } else {
            throw new Error('Failed to revoke session');
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
                    uniqueUsers: { $addToSet: "$_id" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalSessions: 1,
                    uniqueUsersWithSessions: { $size: "$uniqueUsers" }
                }
            }
        ];

        const result = await User.aggregate(pipeline);
        
        return result[0] || {
            totalSessions: 0,
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