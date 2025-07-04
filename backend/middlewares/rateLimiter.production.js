import rateLimit from 'express-rate-limit';

// Production-ready rate limiting configuration
// This file provides secure configurations for different environments

// Helper function to get client identifier
const getClientIdentifier = (req) => {
    // In production behind a trusted proxy
    if (process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY) {
        // Use the real IP from trusted proxy
        const forwardedIPs = req.headers['x-forwarded-for'];
        if (forwardedIPs) {
            return forwardedIPs.split(',')[0].trim();
        }
    }
    
    // Default to connection IP
    return req.connection?.remoteAddress || req.ip || 'unknown';
};

// Production rate limiter with proxy support
export const createProductionLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 100,
        message: options.message || {
            error: 'Too many requests, please try again later.',
            statusCode: 429
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // Use a combination of IP and user ID for authenticated requests
            const ip = getClientIdentifier(req);
            const userId = req.user?._id || 'anonymous';
            return `${ip}-${userId}`;
        },
        // Skip trust proxy validation for custom key generator
        validate: {
            trustProxy: false
        },
        ...options
    });
};

// Development rate limiter (less strict)
export const createDevelopmentLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 1000, // More lenient in development
        message: options.message || {
            error: 'Too many requests, please try again later.',
            statusCode: 429
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => req.ip || 'localhost',
        validate: {
            trustProxy: false
        },
        ...options
    });
};

// Choose appropriate limiter based on environment
const createLimiter = process.env.NODE_ENV === 'production' 
    ? createProductionLimiter 
    : createDevelopmentLimiter;

// Export configured limiters
export const generalLimiter = createLimiter({
    max: parseInt(process.env.GENERAL_RATE_LIMIT) || 100,
    windowMs: 15 * 60 * 1000
});

export const authLimiter = createLimiter({
    max: parseInt(process.env.AUTH_RATE_LIMIT) || 5,
    windowMs: 15 * 60 * 1000,
    skipSuccessfulRequests: true,
    message: {
        error: 'Too many authentication attempts, please try again later.',
        statusCode: 429
    }
});

export const sessionLimiter = createLimiter({
    max: parseInt(process.env.SESSION_RATE_LIMIT) || 10,
    windowMs: 5 * 60 * 1000,
    message: {
        error: 'Too many session management requests, please try again later.',
        statusCode: 429
    }
});
