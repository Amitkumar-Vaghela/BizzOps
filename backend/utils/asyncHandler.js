import { logger } from './logger.js';

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => {
            // Log the error for debugging
            logger.error('AsyncHandler caught error', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                url: req.url,
                method: req.method,
                statusCode: error.statusCode
            });
            next(error);
        });
    };
};

export { asyncHandler };