import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Agent } from "../models/agent.model.js";
import { InventoryAgent } from "../agents/agent.js";
import { ImageInventoryAgent } from "../agents/tools.js";

// Create a new agent
const createAgent = asyncHandler(async (req, res) => {
    const { name, type, description, capabilities, apiKey, model, temperature, maxTokens, systemPrompt, config } = req.body;

    if (!name || !type || !apiKey) {
        throw new ApiError(400, "Name, type, and API key are required");
    }

    // Check if agent with same name already exists for this user
    const existingAgent = await Agent.findOne({ 
        name: name.trim(), 
        owner: req.user._id 
    });

    if (existingAgent) {
        throw new ApiError(409, "Agent with this name already exists");
    }

    const agent = await Agent.create({
        name: name.trim(),
        type,
        description: description?.trim(),
        capabilities: capabilities || [],
        apiKey,
        model: model || "anthropic/claude-3.5-sonnet",
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000,
        systemPrompt: systemPrompt?.trim(),
        config: config || {},
        owner: req.user._id
    });

    const createdAgent = await Agent.findById(agent._id).select("-apiKey");

    if (!createdAgent) {
        throw new ApiError(500, "Something went wrong while creating the agent");
    }

    return res.status(201).json(
        new ApiResponse(201, createdAgent, "Agent created successfully")
    );
});

// Get all agents for the current user
const getAgents = asyncHandler(async (req, res) => {
    const { type, isActive, page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    if (type) options.type = type;
    if (isActive !== undefined) options.isActive = isActive === 'true';

    const result = await Agent.getUserAgents(req.user._id, options);

    // Remove API keys from response
    result.docs = result.docs.map(agent => {
        const { apiKey, ...agentWithoutKey } = agent;
        return agentWithoutKey;
    });

    return res.status(200).json(
        new ApiResponse(200, result, "Agents retrieved successfully")
    );
});

// Get a specific agent by ID
const getAgentById = asyncHandler(async (req, res) => {
    const { agentId } = req.params;

    const agent = await Agent.findOne({ 
        _id: agentId, 
        owner: req.user._id 
    }).select("-apiKey");

    if (!agent) {
        throw new ApiError(404, "Agent not found");
    }

    return res.status(200).json(
        new ApiResponse(200, agent, "Agent retrieved successfully")
    );
});

// Update an agent
const updateAgent = asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.owner;
    delete updates.usage;
    delete updates._id;

    const agent = await Agent.findOne({ 
        _id: agentId, 
        owner: req.user._id 
    });

    if (!agent) {
        throw new ApiError(404, "Agent not found");
    }

    // Check if name is being updated and if it conflicts
    if (updates.name && updates.name !== agent.name) {
        const existingAgent = await Agent.findOne({ 
            name: updates.name.trim(), 
            owner: req.user._id,
            _id: { $ne: agentId }
        });

        if (existingAgent) {
            throw new ApiError(409, "Agent with this name already exists");
        }
    }

    // Update the agent
    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
            agent[key] = updates[key];
        }
    });

    await agent.save();

    const updatedAgent = await Agent.findById(agentId).select("-apiKey");

    return res.status(200).json(
        new ApiResponse(200, updatedAgent, "Agent updated successfully")
    );
});

// Delete an agent
const deleteAgent = asyncHandler(async (req, res) => {
    const { agentId } = req.params;

    const agent = await Agent.findOneAndDelete({ 
        _id: agentId, 
        owner: req.user._id 
    });

    if (!agent) {
        throw new ApiError(404, "Agent not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { deleted: true }, "Agent deleted successfully")
    );
});

// Get agents by type
const getAgentsByType = asyncHandler(async (req, res) => {
    const { type } = req.params;

    const agents = await Agent.getActiveAgentsByType(type, req.user._id);

    // Remove API keys from response
    const agentsWithoutKeys = agents.map(agent => {
        const agentObj = agent.toObject();
        delete agentObj.apiKey;
        return agentObj;
    });

    return res.status(200).json(
        new ApiResponse(200, agentsWithoutKeys, `${type} agents retrieved successfully`)
    );
});

// Process a query with an agent
const processAgentQuery = asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const { query, context } = req.body;

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    const agent = await Agent.findOne({ 
        _id: agentId, 
        owner: req.user._id,
        isActive: true
    });

    if (!agent) {
        throw new ApiError(404, "Agent not found or inactive");
    }

    try {
        let result;

        // Create appropriate agent instance based on type
        switch (agent.type) {
            case 'inventory':
                const inventoryAgent = new InventoryAgent(agent.apiKey);
                result = await inventoryAgent.processInventoryQuery(query, context);
                break;
            
            default:
                // For other types, use a generic implementation
                result = {
                    success: true,
                    message: "Query processed successfully",
                    data: { response: "Generic agent response processing not yet implemented" }
                };
        }

        // Update usage statistics
        await agent.updateUsage(result.success);

        return res.status(200).json(
            new ApiResponse(200, result, "Query processed successfully")
        );

    } catch (error) {
        // Update usage statistics for failed query
        await agent.updateUsage(false);
        
        throw new ApiError(500, `Error processing query: ${error.message}`);
    }
});

// Process image query with agent
const processAgentImageQuery = asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const { query } = req.body;

    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }

    const agent = await Agent.findOne({ 
        _id: agentId, 
        owner: req.user._id,
        isActive: true
    });

    if (!agent) {
        throw new ApiError(404, "Agent not found or inactive");
    }

    try {
        let result;

        // Currently only inventory agents support image processing
        if (agent.type === 'inventory') {
            const imageAgent = new ImageInventoryAgent();
            const authToken = req.headers.authorization?.replace('Bearer ', '');
            
            result = await imageAgent.processImageQuery(
                req.file.buffer,
                query || "Process this image and extract inventory items",
                authToken
            );
        } else {
            throw new ApiError(400, "Image processing not supported for this agent type");
        }

        // Update usage statistics
        await agent.updateUsage(result.success);

        return res.status(200).json(
            new ApiResponse(200, result, "Image query processed successfully")
        );

    } catch (error) {
        // Update usage statistics for failed query
        await agent.updateUsage(false);
        
        throw new ApiError(500, `Error processing image query: ${error.message}`);
    }
});

// Get agent usage statistics
const getAgentUsage = asyncHandler(async (req, res) => {
    const { agentId } = req.params;

    const agent = await Agent.findOne({ 
        _id: agentId, 
        owner: req.user._id 
    }).select("name type usage createdAt");

    if (!agent) {
        throw new ApiError(404, "Agent not found");
    }

    const usageStats = {
        agentId: agent._id,
        name: agent.name,
        type: agent.type,
        createdAt: agent.createdAt,
        usage: agent.usage,
        successRate: agent.getSuccessRate()
    };

    return res.status(200).json(
        new ApiResponse(200, usageStats, "Agent usage statistics retrieved successfully")
    );
});

// Toggle agent active status
const toggleAgentStatus = asyncHandler(async (req, res) => {
    const { agentId } = req.params;

    const agent = await Agent.findOne({ 
        _id: agentId, 
        owner: req.user._id 
    });

    if (!agent) {
        throw new ApiError(404, "Agent not found");
    }

    agent.isActive = !agent.isActive;
    await agent.save();

    const updatedAgent = await Agent.findById(agentId).select("-apiKey");

    return res.status(200).json(
        new ApiResponse(200, updatedAgent, `Agent ${agent.isActive ? 'activated' : 'deactivated'} successfully`)
    );
});

// Legacy inventory functions for backward compatibility
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
        // Use default inventory agent - you may want to get from environment or user settings
        const inventoryAgent = new InventoryAgent(process.env.OPENROUTER_API_KEY);
        const result = await inventoryAgent.processInventoryQuery(query, context);
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Query processed successfully"));
    } catch (error) {
        throw new ApiError(500, `Agent processing failed: ${error.message}`);
    }
});

const processImageQuery = asyncHandler(async (req, res) => {
    const { query } = req.body;
    const authToken = req.headers.authorization?.replace('Bearer ', '');

    if (!authToken) {
        throw new ApiError(401, "Authentication token required");
    }

    if (!req.file) {
        throw new ApiError(400, "Image file is required");
    }

    try {
        const imageAgent = new ImageInventoryAgent();
        const result = await imageAgent.processImageQuery(
            req.file.buffer,
            query || "Process this image and extract inventory items",
            authToken
        );
        
        return res
            .status(200)
            .json(new ApiResponse(200, result, "Image query processed successfully"));
    } catch (error) {
        throw new ApiError(500, `Image processing failed: ${error.message}`);
    }
});

export {
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
};