# BizzOps Agent System

## Overview

The BizzOps Agent System provides intelligent business automation through AI-powered agents. Each agent specializes in specific business functions and can process natural language queries to perform operations and provide insights.

## Structure

```
backend/
├── agents/
│   ├── agent.js           # InventoryAgent class
│   └── tools.js           # LangChain tools and ImageInventoryAgent
├── models/
│   └── agent.model.js     # Agent database model
├── controllers/
│   └── agents.controller.js # Agent API controllers
└── routes/
    └── agents.routes.js   # Agent routes
```

## Agent Types

### Inventory Agent
- **Type**: `inventory`
- **Capabilities**: 
  - Stock management and analysis
  - Image processing for inventory items
  - Inventory optimization recommendations
  - Predictive analytics
  - Report generation

### Sales Agent (Future)
- **Type**: `sales`
- **Capabilities**: Sales analysis, trend prediction, performance insights

### Customer Agent (Future)
- **Type**: `customer`
- **Capabilities**: Customer relationship management, behavior analysis

### Expense Agent (Future)
- **Type**: `expense`
- **Capabilities**: Expense tracking, cost optimization, budget analysis

## API Endpoints

### Agent Management (CRUD)
- `POST /api/v1/agent/` - Create new agent
- `GET /api/v1/agent/` - Get all user's agents
- `GET /api/v1/agent/:agentId` - Get specific agent
- `PUT /api/v1/agent/:agentId` - Update agent
- `DELETE /api/v1/agent/:agentId` - Delete agent

### Agent Operations
- `GET /api/v1/agent/type/:type` - Get agents by type
- `POST /api/v1/agent/:agentId/query` - Process text query
- `POST /api/v1/agent/:agentId/image` - Process image query
- `GET /api/v1/agent/:agentId/usage` - Get usage statistics
- `PATCH /api/v1/agent/:agentId/toggle` - Toggle active status

### Legacy Endpoints
- `POST /api/v1/agent/inventory/query` - Process inventory query
- `POST /api/v1/agent/inventory/image` - Process inventory image

## Usage Examples

### Creating an Inventory Agent

```javascript
POST /api/v1/agent/
{
  "name": "My Inventory Assistant",
  "type": "inventory",
  "description": "AI assistant for managing warehouse inventory",
  "apiKey": "your-openrouter-api-key",
  "model": "anthropic/claude-3.5-sonnet",
  "temperature": 0.7,
  "capabilities": ["stock_analysis", "image_processing", "recommendations"]
}
```

### Processing a Query

```javascript
POST /api/v1/agent/:agentId/query
{
  "query": "Analyze my current inventory and suggest items to reorder",
  "context": {
    "threshold": 10,
    "category": "electronics"
  }
}
```

### Processing an Image

```javascript
POST /api/v1/agent/:agentId/image
Content-Type: multipart/form-data

image: [file upload]
query: "Extract items from this invoice and add to inventory"
```

## Agent Model Schema

```javascript
{
  name: String,              // Agent name
  type: String,              // Agent type (inventory, sales, etc.)
  description: String,       // Agent description
  capabilities: [String],    // List of capabilities
  apiKey: String,           // OpenRouter API key
  model: String,            // AI model to use
  temperature: Number,      // AI temperature (0-2)
  maxTokens: Number,        // Max tokens per request
  isActive: Boolean,        // Active status
  systemPrompt: String,     // Custom system prompt
  config: Map,              // Additional configuration
  usage: {
    totalQueries: Number,
    successfulQueries: Number,
    failedQueries: Number,
    lastUsed: Date
  },
  owner: ObjectId           // User who owns the agent
}
```

## Features

### Image Processing
- Automatic text extraction from images
- Smart parsing of inventory items
- Bulk inventory addition from images
- Support for multiple image formats

### Analytics & Insights
- Stock level analysis
- Demand prediction
- Cost optimization
- Performance metrics

### Usage Tracking
- Query success rates
- Usage statistics
- Performance monitoring
- Cost tracking

## Configuration

Add the following environment variables:

```env
OPENROUTER_API_KEY=your-openrouter-api-key
API_BASE_URL=http://localhost:8000
```

## Dependencies

- `@langchain/core` - LangChain core functionality
- `@langchain/openai` - OpenAI/OpenRouter integration
- `@langchain/langgraph` - Agent framework
- `axios` - HTTP client
- `multer` - File upload handling
- `zod` - Schema validation

## Future Enhancements

1. **Multi-Agent Workflows**: Chain multiple agents for complex tasks
2. **Custom Agent Types**: User-defined agent types and capabilities
3. **Agent Marketplace**: Share and discover community agents
4. **Voice Integration**: Voice-to-text query processing
5. **Real-time Collaboration**: Multi-user agent interactions
6. **Advanced Analytics**: Machine learning insights
7. **Integration Hub**: Connect with external business tools

## Security

- All agents are scoped to the user who created them
- API keys are encrypted in the database
- Rate limiting and usage monitoring
- Audit trails for all agent operations
