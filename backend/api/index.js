import dotenv from 'dotenv';
import connectDB from '../backend/db/index.js';
import { app } from '../backend/src/app.js';
import { logger } from '../backend/utils/logger.js';

dotenv.config();

let isConnected = false;

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

export default async function handler(req, res) {
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
}