import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import { generalLimiter } from '../middlewares/rateLimiter.js';
import { logger } from '../utils/logger.js';
import { requestLogger, errorLogger } from '../middlewares/logger.middleware.js';

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS Blocked Origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(requestLogger);
}

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 
app.use(cookieParser());

// Configure trust proxy more securely
// In development, we don't need proxy trust
// In production, configure this based on your specific proxy setup
if (process.env.NODE_ENV === 'production') {
    // Configure trust proxy for production (adjust based on your setup)
    app.set('trust proxy', 1); // Trust first proxy
} else {
    // In development, don't trust proxy
    app.set('trust proxy', false);
}

// Apply rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

import userRouter from "../routes/user.routes.js";
import inventoryRouter from "../routes/inventory.routes.js";
import salesRouter from "../routes/sales.routes.js";
import customerRouter from "../routes/customer.routes.js";
import invoiceRouter from "../routes/invoice.routes.js";
import staffRouter from '../routes/staff.routes.js';
import expenseRouter from "../routes/expense.routes.js";
import notesRouter from "../routes/notes.routes.js";
import ordersRouter from "../routes/orders.routes.js";
import agentRoutes from "../routes/agents.routes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/sales", salesRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/agent", agentRoutes);

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
    // Log the error with detailed information
    logger.error('API Error occurred', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body,
        query: req.query,
        params: req.params
    });

    // Default error values
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { statusCode: 404, message };
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { statusCode: 400, message };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { statusCode: 400, message };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { statusCode: 401, message };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { statusCode: 401, message };
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    logger.warn('Route not found', {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });
    
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

export { app };
