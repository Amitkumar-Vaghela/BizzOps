import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        // Set mongoose options for better error handling
        mongoose.set('strictQuery', false);
        
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });

        logger.info(`BizDB connected successfully`, {
            host: connectionInstance.connection.host,
            name: connectionInstance.connection.name,
            port: connectionInstance.connection.port
        });

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', { error: error.message });
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        // Graceful exit
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (error) {
                logger.error('Error during MongoDB disconnection:', { error: error.message });
                process.exit(1);
            }
        });

    } catch (error) {
        logger.error("BizDB connection failed:", { 
            error: error.message, 
            stack: error.stack 
        });
        process.exit(1);
    }
};

export default connectDB;