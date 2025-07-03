import axios from 'axios';

class InventoryAgent {
    constructor(apiKey) {
        this.openRouterApiKey = apiKey;
        this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.modelName = 'anthropic/claude-3.5-sonnet';
    }

    async callOpenRouter(prompt) {
        try {
            const response = await axios.post(
                this.baseUrl,
                {
                    model: this.modelName,
                    messages: [
                        {
                            role: 'system',
                            content: `You are an intelligent inventory management agent for BizzOps. You help manage inventory operations including adding items, updating stock, analyzing inventory data, and providing insights. Always respond with JSON format containing action, parameters, and reasoning. Available actions: ADD_ITEM, GET_ITEMS, ADD_STOCK, REMOVE_STOCK, DELETE_ITEM, ANALYZE_INVENTORY, STOCK_ALERT.`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openRouterApiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://bizzops.vercel.app',
                        'X-Title': 'BizzOps Inventory Agent'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenRouter API Error:', error.response?.data || error.message);
            throw new Error(`Failed to get AI response: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    async processInventoryQuery(query, context) {
        try {
            const contextInfo = context ? `\nContext: ${JSON.stringify(context)}` : '';
            const prompt = `
                Inventory Management Query: ${query}${contextInfo}
                
                Please analyze this request and determine the appropriate action. Consider:
                1. What inventory operation is needed?
                2. What parameters are required?
                3. Any validation or business logic requirements?
                4. Potential recommendations or insights?
                
                Respond with a JSON object containing:
                - action: The specific inventory action needed
                - parameters: Required parameters for the action
                - reasoning: Why this action was chosen
                - recommendations: Any additional suggestions
            `;

            const aiResponse = await this.callOpenRouter(prompt);
            
            try {
                const parsedResponse = JSON.parse(aiResponse);
                return {
                    success: true,
                    data: parsedResponse,
                    message: 'Query processed successfully',
                    action: parsedResponse.action
                };
            } catch (parseError) {
                return {
                    success: true,
                    data: { reasoning: aiResponse },
                    message: 'Query processed (text response)',
                    action: 'ANALYZE'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Error processing query: ${error.message}`
            };
        }
    }

    async analyzeInventoryData(inventoryItems) {
        try {
            const prompt = `
                Analyze this inventory data and provide insights:
                ${JSON.stringify(inventoryItems, null, 2)}
                
                Please provide:
                1. Stock level analysis (low stock alerts, overstocked items)
                2. Category distribution insights
                3. Inventory value trends
                4. Recommendations for inventory optimization
                5. Potential issues or opportunities
                
                Format your response as actionable insights for business decision making.
            `;

            const aiResponse = await this.callOpenRouter(prompt);
            
            return {
                success: true,
                data: { analysis: aiResponse, itemCount: inventoryItems.length },
                message: 'Inventory analysis completed'
            };
        } catch (error) {
            return {
                success: false,
                message: `Error analyzing inventory: ${error.message}`
            };
        }
    }

    async generateStockRecommendations(inventoryItems, salesData) {
        try {
            const lowStockItems = inventoryItems.filter(item => item.stockRemain < 10);
            const overstockedItems = inventoryItems.filter(item => item.stockRemain > 100);
            
            const prompt = `
                Generate stock management recommendations based on:
                
                Current Inventory: ${inventoryItems.length} items
                Low Stock Items: ${lowStockItems.length}
                Overstocked Items: ${overstockedItems.length}
                
                Low Stock Details: ${JSON.stringify(lowStockItems)}
                Overstocked Details: ${JSON.stringify(overstockedItems)}
                
                ${salesData ? `Sales Context: ${JSON.stringify(salesData)}` : ''}
                
                Provide specific recommendations for:
                1. Items to reorder immediately
                2. Optimal stock levels for each category
                3. Items to promote or discount
                4. Inventory turnover improvements
                5. Cost optimization strategies
            `;

            const aiResponse = await this.callOpenRouter(prompt);
            
            return {
                success: true,
                data: {
                    recommendations: aiResponse,
                    lowStockCount: lowStockItems.length,
                    overstockedCount: overstockedItems.length,
                    totalItems: inventoryItems.length
                },
                message: 'Stock recommendations generated'
            };
        } catch (error) {
            return {
                success: false,
                message: `Error generating recommendations: ${error.message}`
            };
        }
    }

    async predictInventoryNeeds(inventoryItems, historicalData) {
        try {
            const prompt = `
                Predict future inventory needs based on:
                
                Current Inventory: ${JSON.stringify(inventoryItems)}
                ${historicalData ? `Historical Data: ${JSON.stringify(historicalData)}` : ''}
                
                Analyze patterns and predict:
                1. Which items will run out of stock in the next 30 days
                2. Seasonal demand variations
                3. Optimal reorder points for each item
                4. Budget requirements for next month's inventory
                5. New product opportunities based on trends
                
                Provide actionable predictions with confidence levels.
            `;

            const aiResponse = await this.callOpenRouter(prompt);
            
            return {
                success: true,
                data: { predictions: aiResponse },
                message: 'Inventory predictions generated'
            };
        } catch (error) {
            return {
                success: false,
                message: `Error predicting inventory needs: ${error.message}`
            };
        }
    }

    async optimizeInventoryLayout(inventoryItems) {
        try {
            const categories = [...new Set(inventoryItems.map(item => item.category))];
            const categoryStats = categories.map(category => ({
                category,
                itemCount: inventoryItems.filter(item => item.category === category).length,
                totalStock: inventoryItems
                    .filter(item => item.category === category)
                    .reduce((sum, item) => sum + item.stockRemain, 0)
            }));

            const prompt = `
                Optimize inventory organization based on:
                
                Categories: ${JSON.stringify(categoryStats)}
                Total Items: ${inventoryItems.length}
                
                Provide recommendations for:
                1. Warehouse/storage layout optimization
                2. Category grouping strategies
                3. Fast-moving vs slow-moving item placement
                4. Inventory picking efficiency improvements
                5. Space utilization optimization
                
                Consider both operational efficiency and cost reduction.
            `;

            const aiResponse = await this.callOpenRouter(prompt);
            
            return {
                success: true,
                data: {
                    optimization: aiResponse,
                    categoryStats,
                    totalCategories: categories.length
                },
                message: 'Inventory layout optimization completed'
            };
        } catch (error) {
            return {
                success: false,
                message: `Error optimizing inventory layout: ${error.message}`
            };
        }
    }

    async generateInventoryReport(inventoryItems, reportType) {
        try {
            const totalValue = inventoryItems.reduce((sum, item) => sum + (item.stockRemain * 1), 0);
            const lowStockItems = inventoryItems.filter(item => item.stockRemain < 10);
            const categories = [...new Set(inventoryItems.map(item => item.category))];

            const prompt = `
                Generate a ${reportType} inventory report based on:
                
                Total Items: ${inventoryItems.length}
                Total Categories: ${categories.length}
                Low Stock Alerts: ${lowStockItems.length}
                Estimated Total Value: ${totalValue}
                
                Inventory Data: ${JSON.stringify(inventoryItems)}
                
                For ${reportType} report, include:
                ${reportType === 'summary' ? '- Executive summary with key metrics\n- Top insights and trends\n- Critical action items' : ''}
                ${reportType === 'detailed' ? '- Complete item-by-item analysis\n- Category breakdowns\n- Stock movement patterns\n- Detailed recommendations' : ''}
                ${reportType === 'alerts' ? '- Critical stock alerts\n- Immediate action items\n- Risk assessments\n- Urgent recommendations' : ''}
                
                Format as a professional business report.
            `;

            const aiResponse = await this.callOpenRouter(prompt);
            
            return {
                success: true,
                data: {
                    report: aiResponse,
                    metrics: {
                        totalItems: inventoryItems.length,
                        totalCategories: categories.length,
                        lowStockAlerts: lowStockItems.length,
                        estimatedValue: totalValue
                    }
                },
                message: `${reportType} inventory report generated`
            };
        } catch (error) {
            return {
                success: false,
                message: `Error generating inventory report: ${error.message}`
            };
        }
    }
}

export { InventoryAgent };
