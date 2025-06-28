// routes/agent.routes.js
import { Router } from "express";
import {
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
} from "../controllers/agents.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { ImageInventoryAgent } from "../../agents/src/tools.js";
const inventoryAgent = new ImageInventoryAgent()
export const inventoryAgentHandler = async (req, res) => {
    try {
        const { query, authToken, context } = req.body;

        // Validate required fields
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }

        if (!authToken) {
            return res.status(400).json({
                success: false,
                message: 'Authentication token is required'
            });
        }

        // Process the query using the inventory agent
        const result = await inventoryAgent.processQuery(query, authToken, context);

        return res.status(200).json(result);
    } catch (error) {
        console.error('Inventory Agent API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

const router = Router();

// Core agent endpoints
router.route('/inventory/query').post(verifyJWT, processInventoryQuery);
router.route('/inventory/execute').post(verifyJWT, executeInventoryOperation);

// Analysis and insights endpoints
router.route('/inventory/analyze').get(verifyJWT, analyzeInventory);
router.route('/inventory/recommendations').post(verifyJWT, getStockRecommendations);
router.route('/inventory/predictions').post(verifyJWT, predictInventoryNeeds);
router.route('/inventory/optimize-layout').get(verifyJWT, optimizeInventoryLayout);
router.route('/inventory/report').post(verifyJWT, generateInventoryReport);
router.route('/inventory/insights').get(verifyJWT, getInventoryInsights);

// Direct operation endpoints (using agent)
router.route('/inventory/add-item-agent').post(verifyJWT, addInventoryItemWithAgent);
router.route('/inventory/update-stock-agent').post(verifyJWT, updateStockWithAgent);
router.route('/inventory-agent').post(inventoryAgentHandler);

export default router;