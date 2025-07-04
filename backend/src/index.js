    import dotenv from 'dotenv'
    import connectDB from '../db/index.js';
    import { app } from './app.js';
    import { logger } from '../utils/logger.js';

    dotenv.config({
        path:'./env'
    })

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
        // Give ongoing requests a chance to complete
        if (server) {
            server.close(() => {
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });

    let server;

    connectDB()
    .then(()=>{
        server = app.listen(process.env.PORT || 8000, ()=>{
            logger.info(`Server is running at port ${process.env.PORT || 8000}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            logger.error('Server error:', { error: error.message, stack: error.stack });
        });
    })
    .catch((error)=>{
        logger.error("MONGODB connection failed", { error: error.message, stack: error.stack });
        process.exit(1);
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
        server.close(() => {
            logger.info('💥 Process terminated!');
        });
    });