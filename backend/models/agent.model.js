import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const agentSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Agent name is required"],
            trim: true,
            maxlength: [100, "Agent name cannot exceed 100 characters"]
        },
        type: {
            type: String,
            required: [true, "Agent type is required"],
            enum: ["inventory", "sales", "customer", "expense", "general"],
            default: "general"
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"]
        },
        capabilities: [{
            type: String,
            trim: true
        }],
        apiKey: {
            type: String,
            required: [true, "API key is required"]
        },
        model: {
            type: String,
            default: "anthropic/claude-3.5-sonnet"
        },
        temperature: {
            type: Number,
            default: 0.7,
            min: 0,
            max: 2
        },
        maxTokens: {
            type: Number,
            default: 1000,
            min: 1,
            max: 4000
        },
        isActive: {
            type: Boolean,
            default: true
        },
        systemPrompt: {
            type: String,
            trim: true,
            maxlength: [2000, "System prompt cannot exceed 2000 characters"]
        },
        config: {
            type: Map,
            of: Schema.Types.Mixed,
            default: new Map()
        },
        usage: {
            totalQueries: {
                type: Number,
                default: 0
            },
            successfulQueries: {
                type: Number,
                default: 0
            },
            failedQueries: {
                type: Number,
                default: 0
            },
            lastUsed: {
                type: Date
            }
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Owner is required"]
        }
    },
    {
        timestamps: true
    }
);

// Indexes for better performance
agentSchema.index({ owner: 1, type: 1 });
agentSchema.index({ owner: 1, isActive: 1 });
agentSchema.index({ name: 1, owner: 1 });

// Add pagination plugin
agentSchema.plugin(mongooseAggregatePaginate);

// Instance methods
agentSchema.methods.updateUsage = function(success = true) {
    this.usage.totalQueries += 1;
    if (success) {
        this.usage.successfulQueries += 1;
    } else {
        this.usage.failedQueries += 1;
    }
    this.usage.lastUsed = new Date();
    return this.save();
};

agentSchema.methods.getSuccessRate = function() {
    if (this.usage.totalQueries === 0) return 0;
    return (this.usage.successfulQueries / this.usage.totalQueries) * 100;
};

// Static methods
agentSchema.statics.getActiveAgentsByType = function(type, ownerId) {
    return this.find({ 
        type, 
        owner: ownerId, 
        isActive: true 
    }).sort({ createdAt: -1 });
};

agentSchema.statics.getUserAgents = function(ownerId, options = {}) {
    const { type, isActive, page = 1, limit = 10 } = options;
    
    const match = { owner: ownerId };
    if (type) match.type = type;
    if (isActive !== undefined) match.isActive = isActive;
    
    const aggregateQuery = this.aggregate([
        { $match: match },
        {
            $addFields: {
                successRate: {
                    $cond: {
                        if: { $eq: ["$usage.totalQueries", 0] },
                        then: 0,
                        else: {
                            $multiply: [
                                { $divide: ["$usage.successfulQueries", "$usage.totalQueries"] },
                                100
                            ]
                        }
                    }
                }
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
    
    return this.aggregatePaginate(aggregateQuery, { page, limit });
};

// Pre-save middleware
agentSchema.pre('save', function(next) {
    if (this.isNew) {
        // Set default system prompt based on type
        if (!this.systemPrompt) {
            switch (this.type) {
                case 'inventory':
                    this.systemPrompt = 'You are an intelligent inventory management agent for BizzOps. You help manage inventory operations including adding items, updating stock, analyzing inventory data, and providing insights.';
                    break;
                case 'sales':
                    this.systemPrompt = 'You are a sales analysis agent for BizzOps. You help analyze sales data, generate reports, identify trends, and provide sales insights.';
                    break;
                case 'customer':
                    this.systemPrompt = 'You are a customer service agent for BizzOps. You help manage customer relationships, analyze customer data, and provide customer insights.';
                    break;
                case 'expense':
                    this.systemPrompt = 'You are an expense management agent for BizzOps. You help track expenses, analyze spending patterns, and provide cost optimization insights.';
                    break;
                default:
                    this.systemPrompt = 'You are a general purpose business assistant for BizzOps. You help with various business operations and provide insights.';
            }
        }
    }
    next();
});

export const Agent = mongoose.model("Agent", agentSchema);
