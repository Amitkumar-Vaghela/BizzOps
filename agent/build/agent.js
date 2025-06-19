"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.env.GOOGLE_API_KEY = process.env.AGENT_KEY;
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const google_genai_1 = require("@langchain/google-genai");
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const API_BASE_URL = "http://localhost:8000";
const fetchJson = async (url, method, body) => {
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
const addItemTool = (0, tools_1.tool)(async ({ item, category, stockRemain, date }) => {
    return await fetchJson(`${API_BASE_URL}/api/inventory/add-item`, "POST", {
        item,
        category,
        stockRemain,
        date
    });
}, {
    name: "addInventoryItem",
    description: "Add a new item to inventory.",
    schema: zod_1.z.object({
        item: zod_1.z.string(),
        category: zod_1.z.string(),
        stockRemain: zod_1.z.number(),
        date: zod_1.z.string(),
    }),
});
const getInventoryTool = (0, tools_1.tool)(async () => {
    return await fetchJson(`${API_BASE_URL}/api/inventory/get-item`, "GET");
}, {
    name: "getInventoryItem",
    description: "Get all inventory items for the current user.",
    schema: zod_1.z.object({}),
});
const addStockTool = (0, tools_1.tool)(async ({ product, newQty }) => {
    return await fetchJson(`${API_BASE_URL}/api/inventory/add-stock`, "POST", {
        product,
        newQty
    });
}, {
    name: "addStock",
    description: "Add stock to an existing inventory item.",
    schema: zod_1.z.object({
        product: zod_1.z.string(),
        newQty: zod_1.z.number(),
    }),
});
const removeStockTool = (0, tools_1.tool)(async ({ product, newQty }) => {
    return await fetchJson(`${API_BASE_URL}/api/inventory/remove-stock`, "POST", {
        product,
        newQty
    });
}, {
    name: "removeStock",
    description: "Remove stock from an inventory item.",
    schema: zod_1.z.object({
        product: zod_1.z.string(),
        newQty: zod_1.z.number(),
    }),
});
const deleteItemTool = (0, tools_1.tool)(async ({ product }) => {
    return await fetchJson(`${API_BASE_URL}/api/inventory/delete-item`, "POST", {
        product
    });
}, {
    name: "deleteInventoryItem",
    description: "Delete an inventory item.",
    schema: zod_1.z.object({
        product: zod_1.z.string(),
    }),
});
const model = new google_genai_1.ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro-exp-03-25"
});
const agent = (0, prebuilt_1.createReactAgent)({
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
