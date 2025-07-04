import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import { generalLimiter } from '../middlewares/rateLimiter.js';

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

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Something went wrong!' 
    });
});

export { app };
