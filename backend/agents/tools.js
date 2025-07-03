import dotenv from "dotenv";
dotenv.config();

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import multer from "multer";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

// Configure OpenRouter model with vision capabilities
const model = new ChatOpenAI({
  model: "anthropic/claude-3.5-sonnet", // or "openai/gpt-4-vision-preview", "google/gemini-pro-vision"
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "BizzOps",
    },
  },
  temperature: 0.3,
  maxTokens: 1000,
});

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Utility function for API calls
const fetchJson = async (url, method, body, authToken) => {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch(url, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
      "Accept": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
};

// Function to detect MIME type from buffer
const detectMimeType = (buffer) => {
  const signature = buffer.slice(0, 4).toString('hex');
  
  if (signature.startsWith('ffd8ff')) return 'image/jpeg';
  if (signature.startsWith('89504e47')) return 'image/png';
  if (signature.startsWith('47494638')) return 'image/gif';
  if (signature.startsWith('52494646')) return 'image/webp';
  
  return 'image/jpeg'; // Default fallback
};

// Function to extract text from image using OpenRouter
const extractTextFromImage = async (imageBuffer) => {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    const mimeType = detectMimeType(imageBuffer);
    
    // Use OpenRouter's vision model for text extraction - proper format for OpenAI-compatible API
    const response = await model.invoke([
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this image and extract all visible text, focusing on item names, quantities, and product information. Look for:\n- Product names or item descriptions\n- Quantities (numbers like 5x, 10 units, etc.)\n- Categories if visible\n- Any inventory-related information\n\nFormat your response as structured data:\nItem: [item name], Quantity: [number], Category: [category if visible]\n\nIf you see multiple items, list each one separately on a new line."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ]
      }
    ]);

    return response.content || "No text detected in image";
  } catch (error) {
    console.error("Error extracting text from image:", error);
    
    // Fallback: Try with direct OpenRouter API call if LangChain fails
    try {
      const fallbackResponse = await extractTextWithDirectAPI(imageBuffer);
      return fallbackResponse;
    } catch (fallbackError) {
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  }
};

// Fallback function for direct OpenRouter API call
const extractTextWithDirectAPI = async (imageBuffer) => {
  const base64Image = imageBuffer.toString('base64');
  const mimeType = detectMimeType(imageBuffer);
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Inventory Management Agent'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet', // or another vision model
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and extract all visible text, focusing on item names, quantities, and product information. Look for:\n- Product names or item descriptions\n- Quantities (numbers like 5x, 10 units, etc.)\n- Categories if visible\n- Any inventory-related information\n\nFormat your response as structured data:\nItem: [item name], Quantity: [number], Category: [category if visible]\n\nIf you see multiple items, list each one separately on a new line.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No text detected in image";
};

// Function to parse extracted text into structured data
const parseExtractedText = (extractedText) => {
  try {
    const lines = extractedText.split('\n').filter(line => line.trim());
    const items = [];
    
    // First try to parse structured format
    for (const line of lines) {
      const itemMatch = line.match(/Item:\s*(.+?)(?:,|$)/i);
      const quantityMatch = line.match(/Quantity:\s*(\d+)/i);
      const categoryMatch = line.match(/Category:\s*(.+?)(?:,|$)/i);
      
      if (itemMatch && quantityMatch) {
        items.push({
          item: itemMatch[1].trim(),
          quantity: parseInt(quantityMatch[1]),
          category: categoryMatch ? categoryMatch[1].trim() : "General"
        });
      }
    }
    
    // Enhanced parsing - look for patterns like "5x Laptop", "10 phones", etc.
    if (items.length === 0) {
      const patterns = [
        /(\d+)x?\s+([a-zA-Z\s]+)/gi, // "5x laptop", "10 phones"
        /([a-zA-Z\s]+):\s*(\d+)/gi,  // "laptop: 5", "phone: 10"
        /(\d+)\s+([a-zA-Z\s]+)/gi    // "5 laptop", "10 phone"
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(extractedText)) !== null) {
          let quantity, item;
          
          if (pattern.source.includes('([a-zA-Z\\s]+):\\s*(\\d+)')) {
            // For "item: quantity" pattern
            item = match[1].trim();
            quantity = parseInt(match[2]);
          } else {
            // For "quantity item" patterns
            quantity = parseInt(match[1]);
            item = match[2] ? match[2].trim() : match[1].trim();
          }
          
          if (quantity > 0 && item.length > 1) {
            items.push({
              item: item,
              quantity: quantity,
              category: "General"
            });
          }
        }
        if (items.length > 0) break;
      }
    }
    
    // If still no items found, try to extract from natural language
    if (items.length === 0) {
      const words = extractedText.toLowerCase().split(/\s+/);
      const numbers = extractedText.match(/\d+/g);
      
      if (numbers && numbers.length > 0) {
        // Simple fallback: assume first number is quantity and try to find item name
        const quantity = parseInt(numbers[0]);
        const itemWords = words.filter(word => 
          word.length > 2 && 
          !word.match(/^\d+$/) && 
          !['the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for'].includes(word)
        );
        
        if (itemWords.length > 0 && quantity > 0) {
          items.push({
            item: itemWords.slice(0, 3).join(' '), // Take first few words as item name
            quantity: quantity,
            category: "General"
          });
        }
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error parsing extracted text:", error);
    return [];
  }
};

// Tool for processing image and adding items to inventory
const processImageAndAddItemsTool = tool(async ({ imageBuffer, authToken }) => {
  try {
    // Extract text from image
    const extractedText = await extractTextFromImage(imageBuffer);
    
    // Parse extracted text into structured data
    const parsedItems = parseExtractedText(extractedText);
    
    if (parsedItems.length === 0) {
      return {
        success: false,
        message: "❌ No items could be extracted from the image",
        extractedText: extractedText,
        error: "No parseable items found"
      };
    }
    
    // Add each item to inventory
    const results = [];
    for (const item of parsedItems) {
      try {
        const result = await fetchJson(`${API_BASE_URL}/api/v1/inventory/add-item`, "POST", {
          item: item.item,
          category: item.category,
          stockRemain: item.quantity,
          date: new Date().toISOString().split('T')[0]
        }, authToken);
        
        results.push({
          success: true,
          item: item.item,
          quantity: item.quantity,
          category: item.category,
          data: result
        });
      } catch (error) {
        results.push({
          success: false,
          item: item.item,
          error: error.message
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;
    
    return {
      success: successCount > 0,
      message: `✅ Successfully added ${successCount} items to inventory${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
      extractedText: extractedText,
      parsedItems: parsedItems,
      results: results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failedCount
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: `❌ Failed to process image: ${error.message}`,
      error: error.toString()
    };
  }
}, {
  name: "processImageAndAddItems",
  description: "Process an image to extract item information and add items to inventory.",
  schema: z.object({
    imageBuffer: z.any(),
    authToken: z.string()
  }),
});

// Tool for getting inventory
const getInventoryTool = tool(async ({ authToken }) => {
  try {
    const result = await fetchJson(`${API_BASE_URL}/api/v1/inventory/get-item`, "GET", null, authToken);
    
    if (result && result.data && result.data.length > 0) {
      return {
        success: true,
        message: `📦 Found ${result.data.length} items in inventory`,
        data: result.data,
        summary: result.data.map(item => ({
          id: item._id || item.id,
          name: item.item || item.name,
          category: item.category,
          stock: item.stockRemain || item.stock,
          date: item.date
        }))
      };
    } else {
      return {
        success: true,
        message: "📦 No items found in inventory",
        data: [],
        summary: []
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `❌ Failed to retrieve inventory: ${error.message}`,
      error: error.toString()
    };
  }
}, {
  name: "getInventoryItem",
  description: "Get all inventory items for the current user.",
  schema: z.object({
    authToken: z.string()
  }),
});

// Tool for adding stock to existing items
const addStockTool = tool(async ({ product, newQty, authToken }) => {
  try {
    const result = await fetchJson(`${API_BASE_URL}/api/v1/inventory/add-stock`, "POST", {
      product,
      newQty
    }, authToken);
    
    return {
      success: true,
      message: `✅ Successfully added ${newQty} units to ${product}`,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Failed to add stock: ${error.message}`,
      error: error.toString()
    };
  }
}, {
  name: "addStock",
  description: "Add stock quantity to an existing inventory item.",
  schema: z.object({
    product: z.string(),
    newQty: z.number(),
    authToken: z.string()
  }),
});

// Create the agent with simplified tools
const agent = createReactAgent({
  llm: model,
  tools: [
    processImageAndAddItemsTool,
    getInventoryTool,
    addStockTool,
  ],
  systemMessage: `You are an intelligent inventory management agent for BizzOps with advanced image processing capabilities using OpenRouter's vision models. Your primary function is to help users manage their inventory by processing images of items and automatically extracting information.

CORE CAPABILITIES:
1. 📸 Process images to extract item information (name, quantity, category) using OpenRouter vision models
2. 📦 Add items to inventory automatically from images
3. 📋 Retrieve and display inventory information
4. ➕ Add stock to existing items

IMAGE PROCESSING WORKFLOW:
1. When user uploads an image, extract text using OpenRouter's vision models (Claude 3.5 Sonnet, GPT-4 Vision, etc.)
2. Parse the extracted text to identify items, quantities, and categories
3. Automatically add identified items to inventory
4. Provide detailed feedback on what was processed

RESPONSE FORMATTING:
- Always provide clear, emoji-enhanced responses
- Use structured formatting for multiple items
- Include success/error indicators
- Provide actionable next steps

RESPONSE EXAMPLES:
For successful image processing:
"✅ Successfully processed image and added 3 items:
📦 Laptop (Quantity: 5) - Electronics
📦 Mouse (Quantity: 10) - Electronics  
📦 Keyboard (Quantity: 8) - Electronics"

For inventory queries:
"📦 Current Inventory (15 items):
- Electronics: 8 items (23 total units)
- Office Supplies: 4 items (15 total units)
- Furniture: 3 items (7 total units)"

Always be helpful and provide clear guidance on how to use the image processing features with OpenRouter.`
});

// Enhanced Agent interface with image processing
class ImageInventoryAgent {
  constructor() {
    this.agent = agent;
  }

  async processImageQuery(imageBuffer, query, authToken) {
    try {
      const messages = [
        {
          role: "user",
          content: `${query}\n\nAuth Token: ${authToken}\n\nImage uploaded for processing via OpenRouter.`
        }
      ];

      // Process image and add items
      const imageResult = await processImageAndAddItemsTool.invoke({
        imageBuffer,
        authToken
      });

      // Let the agent format the response
      const agentQuery = `Process this image result and provide a formatted response: ${JSON.stringify(imageResult)}`;
      const result = await this.agent.invoke({ 
        messages: [{ role: "user", content: agentQuery }] 
      });
      
      const finalMessage = result.messages[result.messages.length - 1];
      
      return { 
        success: imageResult.success, 
        response: finalMessage.content || imageResult.message,
        imageProcessingResult: imageResult,
        fullData: result,
        message: "Image processed successfully via OpenRouter" 
      };
    } catch (error) {
      return { 
        success: false, 
        response: `❌ Error processing image via OpenRouter: ${error.message}`,
        message: `Error: ${error.message}`, 
        error: error.toString() 
      };
    }
  }

  async processQuery(query, authToken, context = null) {
    try {
      const messages = [
        {
          role: "user",
          content: `${query}${context ? `\n\nContext: ${JSON.stringify(context)}` : ''}\n\nAuth Token: ${authToken}`
        }
      ];

      const result = await this.agent.invoke({ messages });
      
      const finalMessage = result.messages[result.messages.length - 1];
      
      return { 
        success: true, 
        response: finalMessage.content || "Operation completed successfully",
        fullData: result,
        message: "Query processed successfully via OpenRouter" 
      };
    } catch (error) {
      return { 
        success: false, 
        response: `❌ Error processing query via OpenRouter: ${error.message}`,
        message: `Error: ${error.message}`, 
        error: error.toString() 
      };
    }
  }
}

// Express middleware for handling image uploads
const handleImageUpload = upload.single('image');

// Export everything needed
export { 
  ImageInventoryAgent, 
  handleImageUpload,
  extractTextFromImage,
  parseExtractedText
};
