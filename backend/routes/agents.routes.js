import { Router } from "express";
import {
    createAgent,
    getAgents,
    getAgentById,
    updateAgent,
    deleteAgent,
    getAgentsByType,
    processAgentQuery,
    processAgentImageQuery,
    getAgentUsage,
    toggleAgentStatus,
    processInventoryQuery,
    processImageQuery
} from "../controllers/agents.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { handleImageUpload } from "../agents/tools.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// CRUD operations for agents
router.post("/", createAgent);                          // Create new agent
router.get("/", getAgents);                             // Get all user's agents
router.get("/:agentId", getAgentById);                  // Get specific agent
router.put("/:agentId", updateAgent);                   // Update agent
router.delete("/:agentId", deleteAgent);                // Delete agent

// Agent operations
router.get("/type/:type", getAgentsByType);             // Get agents by type
router.post("/:agentId/query", processAgentQuery);      // Process query with specific agent
router.post("/:agentId/image", handleImageUpload, processAgentImageQuery); // Process image with agent
router.get("/:agentId/usage", getAgentUsage);           // Get agent usage statistics
router.patch("/:agentId/toggle", toggleAgentStatus);    // Toggle agent active status

// Legacy inventory agent endpoints (for backward compatibility)
router.post("/inventory/query", processInventoryQuery); // Process inventory query
router.post("/inventory/image", handleImageUpload, processImageQuery); // Process inventory image

export default router;