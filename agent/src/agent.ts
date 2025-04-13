import dotenv from "dotenv";
dotenv.config();

process.env.GOOGLE_API_KEY = process.env.AGENT_KEY;

import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const API_BASE_URL = "http://localhost:8000";

const fetchJson = async (url: string, method: string, body?: any) => {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.ACCESS_TOKEN_SECRET}`,
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


const addItemTool = tool(async ({ item, category, stockRemain, date }) => {
  return await fetchJson(`${API_BASE_URL}/api/inventory/add-item`, "POST", {
    item,
    category,
    stockRemain,
    date
  });
}, {
  name: "addInventoryItem",
  description: "Add a new item to inventory.",
  schema: z.object({
    item: z.string(),
    category: z.string(),
    stockRemain: z.number(),
    date: z.string(),
  }),
});

const getInventoryTool = tool(async () => {
  return await fetchJson(`${API_BASE_URL}/api/inventory/get-item`, "GET");
}, {
  name: "getInventoryItem",
  description: "Get all inventory items for the current user.",
  schema: z.object({}),
});

const addStockTool = tool(async ({ product, newQty }) => {
  return await fetchJson(`${API_BASE_URL}/api/inventory/add-stock`, "POST", {
    product,
    newQty
  });
}, {
  name: "addStock",
  description: "Add stock to an existing inventory item.",
  schema: z.object({
    product: z.string(),
    newQty: z.number(),
  }),
});

const removeStockTool = tool(async ({ product, newQty }) => {
  return await fetchJson(`${API_BASE_URL}/api/inventory/remove-stock`, "POST", {
    product,
    newQty
  });
}, {
  name: "removeStock",
  description: "Remove stock from an inventory item.",
  schema: z.object({
    product: z.string(),
    newQty: z.number(),
  }),
});

const deleteItemTool = tool(async ({ product }) => {
  return await fetchJson(`${API_BASE_URL}/api/inventory/delete-item`, "POST", {
    product
  });
}, {
  name: "deleteInventoryItem",
  description: "Delete an inventory item.",
  schema: z.object({
    product: z.string(),
  }),
});


const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro-exp-03-25"
});

const agent = createReactAgent({
  llm: model,
  tools: [
    addItemTool,
    getInventoryTool,
    addStockTool,
    removeStockTool,
    deleteItemTool,
  ],
});


(async () => {
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "Add 20 boxes of pens to the stationery category. Restocked today (2025-04-11)."
      }
    ]
  });

  console.log("Agent Response:", result);
})();
