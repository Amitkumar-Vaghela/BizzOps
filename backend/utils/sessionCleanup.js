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
        
        console.log('Expired sessions cleaned up successfully');
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
                    "activeSessions.$.isActive": false
                }
            }
        );
        
        console.log('Inactive sessions marked successfully');
    } catch (error) {
        console.error('Error marking inactive sessions:', error);
    }
};
