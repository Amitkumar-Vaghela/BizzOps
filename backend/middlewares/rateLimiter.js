import rateLimit from 'express-rate-limit';

// Custom key generator that safely handles proxy IPs
const customKeyGenerator = (req) => {
    // In development, use the actual IP
    if (process.env.NODE_ENV === 'development') {
        return req.ip || req.connection.remoteAddress || 'unknown';
    }
    
    // In production, you should configure this based on your deployment
    // For now, we'll use a combination of IP and user agent for better identification
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    return `${ip}-${userAgent.slice(0, 50)}`; // Limit user agent length
};

// General rate limiting
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
    // Skip trust proxy validation in development
    validate: {
        trustProxy: false
    }
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    keyGenerator: customKeyGenerator,
    validate: {
        trustProxy: false
    }
});

// Session management rate limiting
export const sessionLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // Limit each IP to 10 session requests per windowMs
    message: {
        error: 'Too many session management requests, please try again later.',
        statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: customKeyGenerator,
    validate: {
        trustProxy: false
    }
});
