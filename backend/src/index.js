import dotenv from 'dotenv';
import connectDB from '../db/index.js';
import { app } from './app.js';
import { logger } from '../utils/logger.js';

dotenv.config();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...', {
        name: error.name,
        message: error.message,
        stack: error.stack
    });
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('💥 UNHANDLED REJECTION! Shutting down...', {
        reason: reason,
        promise: promise
    });
    process.exit(1);
});

let isConnected = false;

// Connect to database once
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    
    try {
        await connectDB();
        isConnected = true;
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error("MONGODB connection failed", { 
            error: error.message, 
            stack: error.stack 
        });
        throw error;
    }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    
    connectToDatabase()
        .then(() => {
            const server = app.listen(PORT, () => {
                logger.info(`Server is running at port ${PORT}`);
            });

            // Handle server errors
            server.on('error', (error) => {
                logger.error('Server error:', { 
                    error: error.message, 
                    stack: error.stack 
                });
            });

            // Graceful shutdown
            process.on('SIGTERM', () => {
                logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
                server.close(() => {
                    logger.info('💥 Process terminated!');
                });
            });
        })
        .catch((error) => {
            logger.error("Failed to start server", { 
                error: error.message, 
                stack: error.stack 
            });
            process.exit(1);
        });
}

// Vercel serverless function handler
const handler = async (req, res) => {
    try {
        await connectToDatabase();
        return app(req, res);
    } catch (error) {
        logger.error('Handler error:', { 
            error: error.message, 
            stack: error.stack 
        });
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

export default handler;