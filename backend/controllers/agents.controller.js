// controllers/agent.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Inventory } from "../models/inventory.model.js";
import { InventoryAgent } from "../../agents/src/agent.js";

// Initialize the LangChain agent
const inventoryAgent = new InventoryAgent();

const processInventoryQuery = asyncHandler(async (req, res) => {
    const { query, context } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    try {
        const result = await inventoryAgent.processQuery(query, authToken, context);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Query processed successfully"));
    } catch (error) {
        throw new ApiError(500, `Agent processing failed: ${error.message}`);
    }
});

const executeInventoryOperation = asyncHandler(async (req, res) => {
    const { operation, parameters } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    if (!operation) {
        throw new ApiError(400, "Operation is required");
    }

    try {
        const result = await inventoryAgent.executeInventoryOperation(operation, parameters, authToken);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Operation executed successfully"));
    } catch (error) {
        throw new ApiError(500, `Operation execution failed: ${error.message}`);
    }
});

const analyzeInventory = asyncHandler(async (req, res) => {
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    try {
        const result = await inventoryAgent.processQuery(
            "Analyze my inventory and provide comprehensive insights including stock levels, categories, and optimization opportunities.",
            authToken
        );
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Inventory analysis completed"));
    } catch (error) {
        throw new ApiError(500, `Inventory analysis failed: ${error.message}`);
    }
});

const getStockRecommendations = asyncHandler(async (req, res) => {
    const { salesData } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    try {
        const query = salesData 
            ? `Generate stock management recommendations based on my current inventory and this sales data: ${JSON.stringify(salesData)}`
            : "Generate stock management recommendations for my inventory";
            
        const result = await inventoryAgent.processQuery(query, authToken);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Stock recommendations generated"));
    } catch (error) {
        throw new ApiError(500, `Recommendation generation failed: ${error.message}`);
    }
});

const predictInventoryNeeds = asyncHandler(async (req, res) => {
    const { historicalData } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    try {
        const query = historicalData
            ? `Analyze my inventory and predict future needs based on this historical data: ${JSON.stringify(historicalData)}`
            : "Analyze my inventory patterns and predict future inventory needs for the next 30 days";
            
        const result = await inventoryAgent.processQuery(query, authToken);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Inventory predictions generated"));
    } catch (error) {
        throw new ApiError(500, `Prediction failed: ${error.message}`);
    }
});

const optimizeInventoryLayout = asyncHandler(async (req, res) => {
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    try {
        const result = await inventoryAgent.processQuery(
            "Analyze my inventory and provide recommendations for optimizing warehouse layout, storage organization, and operational efficiency.",
            authToken
        );
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Inventory layout optimization completed"));
    } catch (error) {
        throw new ApiError(500, `Layout optimization failed: ${error.message}`);
    }
});

const generateInventoryReport = asyncHandler(async (req, res) => {
    const { reportType = 'summary' } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    if (!['summary', 'detailed', 'alerts'].includes(reportType)) {
        throw new ApiError(400, "Invalid report type. Use: summary, detailed, or alerts");
    }

    try {
        const result = await inventoryAgent.processQuery(
            `Generate a ${reportType} inventory report with professional formatting and actionable insights.`,
            authToken
        );
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, `${reportType} inventory report generated`));
    } catch (error) {
        throw new ApiError(500, `Report generation failed: ${error.message}`);
    }
});

const getInventoryInsights = asyncHandler(async (req, res) => {
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    try {
        const result = await inventoryAgent.processQuery(
            "Provide comprehensive inventory insights including key metrics, low stock alerts, category distribution, and actionable recommendations.",
            authToken
        );
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Inventory insights generated"));
    } catch (error) {
        throw new ApiError(500, `Insights generation failed: ${error.message}`);
    }
});

// New endpoints for direct operations
const addInventoryItemWithAgent = asyncHandler(async (req, res) => {
    const { item, category, stockRemain, date } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    if (!item || !category || !stockRemain || !date) {
        throw new ApiError(400, "All fields are required: item, category, stockRemain, date");
    }

    try {
        const result = await inventoryAgent.executeInventoryOperation('ADD_ITEM', {
            item,
            category,
            stockRemain,
            date
        }, authToken);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Item added successfully"));
    } catch (error) {
        throw new ApiError(500, `Failed to add item: ${error.message}`);
    }
});

const updateStockWithAgent = asyncHandler(async (req, res) => {
    const { product, newQty, operation } = req.body; // operation: 'add' or 'remove'
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    if (!product || !newQty || !operation) {
        throw new ApiError(400, "Product ID, quantity, and operation (add/remove) are required");
    }

    try {
        const agentOperation = operation === 'add' ? 'ADD_STOCK' : 'REMOVE_STOCK';
        const result = await inventoryAgent.executeInventoryOperation(agentOperation, {
            product,
            newQty
        }, authToken);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, `Stock ${operation}ed successfully`));
    } catch (error) {
        throw new ApiError(500, `Failed to update stock: ${error.message}`);
    }
});


export {
    processInventoryQuery,
    executeInventoryOperation,
    analyzeInventory,
    getStockRecommendations,
    predictInventoryNeeds,
    optimizeInventoryLayout,
    generateInventoryReport,
    getInventoryInsights,
    addInventoryItemWithAgent,
    updateStockWithAgent
};