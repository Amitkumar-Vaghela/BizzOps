import { logger } from '../utils/logger.js';

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log incoming request
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Override res.json to log responses
    const originalJson = res.json;
    res.json = function(body) {
        const responseTime = Date.now() - startTime;
        
        logger.info('Outgoing response', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString()
        });
        
        return originalJson.call(this, body);
    };

    next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
    logger.error('Unhandled error in middleware chain', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    next(err);
};
