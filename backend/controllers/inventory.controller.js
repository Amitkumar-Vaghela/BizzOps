import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Inventory } from "../models/inventory.model.js";
import { Groq } from 'groq-sdk';

const addInventoryItem = asyncHandler(async (req, res) => {
  const { item, category, stockRemain, date } = req.body
  const owner = req.user?._id;

  if (!item || !category || !stockRemain || !date) {
    throw new ApiError(400, "All fields are required");
  }
  if (!owner) {
    throw new ApiError(400, "user not found")
  }

  const addedItem = await Inventory.create({
    owner,
    item,
    category,
    stockRemain,
    date: new Date(date)
  })

  return res
    .status(200)
    .json(new ApiResponse(200, addedItem, "item added to inventory succesfull"))
})

const getInventoryItem = asyncHandler(async (req, res) => {
  const owner = req.user?._id;

  if (!owner) {
    throw new ApiError(400, "User not found");
  }

  const inventoryItems = await Inventory.find({ owner });


  if (!inventoryItems) {
    throw new ApiError(404, "No inventory items found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, inventoryItems || 0, "Inventory items fetched successfully"));
});

const addStock = asyncHandler(async (req, res) => {
  let { product, newQty } = req.body;  // product is a id of product
  newQty = Number(newQty);
  const owner = req.user?._id;

  if (!owner) {
    throw new ApiError(400, "User not found");
  }

  if (!product || !newQty || newQty <= 0) {
    throw new ApiError(400, "Invalid product ID or quantity");
  }

  const inventoryItem = await Inventory.findOne({ _id: product, owner });

  if (!inventoryItem) {
    throw new ApiError(404, "Inventory item not found or you do not own this item");
  }

  inventoryItem.stockRemain += newQty;

  await inventoryItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, inventoryItem, "Stock updated successfully"));
});

const removeStock = asyncHandler(async (req, res) => {
  let { product, newQty } = req.body;  // product is a id of product
  newQty = Number(newQty);
  const owner = req.user?._id;

  if (!owner) {
    throw new ApiError(400, "User not found");
  }

  if (!product || !newQty || newQty <= 0) {
    throw new ApiError(400, "Invalid product ID or quantity");
  }

  const inventoryItem = await Inventory.findOne({ _id: product, owner });

  if (!inventoryItem) {
    throw new ApiError(404, "Inventory item not found or you do not own this item");
  }

  inventoryItem.stockRemain -= newQty;

  await inventoryItem.save();

  return res
    .status(200)
    .json(new ApiResponse(200, inventoryItem, "Stock updated successfully"));
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { product } = req.body;  // product is the id of the inventory item
  const owner = req.user?._id;

  if (!owner) {
    throw new ApiError(400, "User not found");
  }

  if (!product) {
    throw new ApiError(400, "Product ID is required");
  }

  const inventoryItem = await Inventory.deleteOne({ _id: product, owner });

  // if (!inventoryItem) {
  //     throw new ApiError(404, "Inventory item not found or you do not own this item");
  // }

  // await inventoryItem.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Inventory item deleted successfully"));
});









const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Helper function to create context from inventory data
const createInventoryContext = (inventoryItems) => {
  const context = inventoryItems.map(item => {
    return `Item: ${item.item}, Category: ${item.category}, Stock: ${item.stockRemain}, Date: ${new Date(item.date).toLocaleDateString()}, Created: ${new Date(item.createdAt).toLocaleDateString()}`;
  }).join('\n');

  return context;
};

// Helper function to get inventory statistics
const getInventoryStats = (inventoryItems) => {
  const totalItems = inventoryItems.length;
  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stockRemain, 0);
  const outOfStock = inventoryItems.filter(item => item.stockRemain === 0).length;
  const categories = [...new Set(inventoryItems.map(item => item.category))];

  return {
    totalItems,
    totalStock,
    outOfStock,
    categories,
    categoriesCount: categories.length
  };
};

export const queryInventory = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const owner = req.user?._id;

  if (!owner) {
    throw new ApiError(400, "User not found");
  }

  if (!query || query.trim() === '') {
    throw new ApiError(400, "Query is required");
  }

  try {
    // Fetch inventory data
    const inventoryItems = await Inventory.find({ owner });

    if (!inventoryItems || inventoryItems.length === 0) {
      throw new ApiError(404, "No inventory items found");
    }

    // Create context from inventory data
    const inventoryContext = createInventoryContext(inventoryItems);
    const inventoryStats = getInventoryStats(inventoryItems);

    // Create a comprehensive prompt for the LLM
    const systemPrompt = `You are an intelligent inventory assistant. You have access to the user's inventory data and can answer questions about their stock, items, categories, and provide insights.

Inventory Statistics:
- Total Items: ${inventoryStats.totalItems}
- Total Stock: ${inventoryStats.totalStock}
- Out of Stock Items: ${inventoryStats.outOfStock}
- Categories: ${inventoryStats.categories.join(', ')}
- Number of Categories: ${inventoryStats.categoriesCount}

Inventory Data:
${inventoryContext}

Please provide helpful, accurate, and relevant responses based on this inventory data. If the user asks about specific items, stock levels, categories, or wants insights about their inventory, use the provided data to give detailed answers.`;

    const userPrompt = `User Query: ${query}

Please answer this query based on the inventory data provided. Be specific and helpful.`;

    // Call GROQ API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "llama3-8b-8192", // You can change this to other models like "mixtral-8x7b-32768"
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new ApiError(500, "Failed to generate response from AI");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        query,
        response,
        inventoryStats,
        timestamp: new Date().toISOString()
      }, "Inventory query processed successfully")
    );

  } catch (error) {
    console.error('GROQ API Error:', error);

    if (error.message.includes('API key')) {
      throw new ApiError(401, "Invalid GROQ API key");
    }

    throw new ApiError(500, `Failed to process inventory query: ${error.message}`);
  }
});

// Additional endpoint for getting inventory insights
export const getInventoryInsights = asyncHandler(async (req, res) => {
  const owner = req.user?._id;

  if (!owner) {
    throw new ApiError(400, "User not found");
  }

  try {
    const inventoryItems = await Inventory.find({ owner });

    if (!inventoryItems || inventoryItems.length === 0) {
      throw new ApiError(404, "No inventory items found");
    }

    const inventoryContext = createInventoryContext(inventoryItems);
    const inventoryStats = getInventoryStats(inventoryItems);

    const insightPrompt = `Analyze this inventory data and provide key insights, recommendations, and observations:

Inventory Data:
${inventoryContext}

Please provide:
1. Key insights about the inventory
2. Items that need attention (low stock, out of stock)
3. Category analysis
4. Recommendations for inventory management
5. Any patterns or trends you notice`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert inventory analyst. Provide detailed insights and actionable recommendations based on inventory data."
        },
        {
          role: "user",
          content: insightPrompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.5,
      max_tokens: 1500,
    });

    const insights = completion.choices[0]?.message?.content;

    return res.status(200).json(
      new ApiResponse(200, {
        insights,
        inventoryStats,
        timestamp: new Date().toISOString()
      }, "Inventory insights generated successfully")
    );

  } catch (error) {
    console.error('GROQ API Error:', error);
    throw new ApiError(500, `Failed to generate inventory insights: ${error.message}`);
  }
});








import { ImageInventoryAgent, handleImageUpload } from "../../agents/src/tools.js";
const imageInventoryAgent = new ImageInventoryAgent();

// Handle inventory queries with image processing
export const inventoryAgentWithImage = asyncHandler(async (req, res) => {
  // Handle image upload first
  handleImageUpload(req, res, async (err) => {
    if (err) {
      throw new ApiError(400, `Image upload failed: ${err.message}`);
    }

    try {
      const { query } = req.body;
      const authToken = req.headers.authorization?.replace('Bearer ', '');

      if (!authToken) {
        throw new ApiError(401, "Authorization token is required");
      }

      if (!query || query.trim() === '') {
        throw new ApiError(400, "Query is required");
      }

      let result;

      // Check if image was uploaded
      if (req.file) {
        // Process image query
        result = await imageInventoryAgent.processImageQuery(
          req.file.buffer,
          query,
          authToken
        );
      } else {
        // Process text-only query
        result = await imageInventoryAgent.processQuery(
          query,
          authToken
        );
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            query,
            response: result.response,
            success: result.success,
            hasImage: !!req.file,
            imageProcessingResult: result.imageProcessingResult || null,
            timestamp: new Date().toISOString()
          },
          result.success ? "Agent query processed successfully" : "Agent query completed with errors"
        )
      );

    } catch (error) {
      console.error('Agent Error:', error);
      throw new ApiError(500, `Failed to process agent query: ${error.message}`);
    }
  });
});

// Handle text-only inventory queries
export const inventoryAgent = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const authToken = req.headers.authorization?.replace('Bearer ', '');

  if (!authToken) {
    throw new ApiError(401, "Authorization token is required");
  }

  if (!query || query.trim() === '') {
    throw new ApiError(400, "Query is required");
  }

  try {
    const result = await imageInventoryAgent.processQuery(
      query,
      authToken
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          query,
          response: result.response,
          success: result.success,
          timestamp: new Date().toISOString()
        },
        result.success ? "Agent query processed successfully" : "Agent query completed with errors"
      )
    );

  } catch (error) {
    console.error('Agent Error:', error);
    throw new ApiError(500, `Failed to process agent query: ${error.message}`);
  }
});

// Handle image-only processing (without query)
export const processImageOnly = asyncHandler(async (req, res) => {
  handleImageUpload(req, res, async (err) => {
    if (err) {
      throw new ApiError(400, `Image upload failed: ${err.message}`);
    }

    if (!req.file) {
      throw new ApiError(400, "Image file is required");
    }

    try {
      const authToken = req.headers.authorization?.replace('Bearer ', '');

      if (!authToken) {
        throw new ApiError(401, "Authorization token is required");
      }

      const result = await imageInventoryAgent.processImageQuery(
        req.file.buffer,
        "Process this image and add items to my inventory",
        authToken
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            response: result.response,
            success: result.success,
            imageProcessingResult: result.imageProcessingResult,
            timestamp: new Date().toISOString()
          },
          result.success ? "Image processed successfully" : "Image processing completed with errors"
        )
      );

    } catch (error) {
      console.error('Image Processing Error:', error);
      throw new ApiError(500, `Failed to process image: ${error.message}`);
    }
  });
});


export {
  addInventoryItem,
  getInventoryItem,
  addStock,
  removeStock,
  deleteInventoryItem
}