import { Router } from "express";
import { addInventoryItem, addStock, deleteInventoryItem, getInventoryInsights, getInventoryItem, inventoryAgent, inventoryAgentWithImage, processImageOnly, queryInventory, removeStock } from "../controllers/inventory.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/add-item').post(verifyJWT, addInventoryItem)
router.route('/get-item').get(verifyJWT, getInventoryItem)
router.route('/add-stock').post(verifyJWT, addStock)
router.route('/remove-stock').post(verifyJWT, removeStock)
router.route('/delete-item').post(verifyJWT, deleteInventoryItem)


router.route('/query').post(verifyJWT, queryInventory);
router.route('/insights').get(verifyJWT, getInventoryInsights);


router.route('/inventory-agent-with-image').post(verifyJWT, inventoryAgentWithImage);

// Route for text-only queries
router.route('/inventory-agent').post(verifyJWT, inventoryAgent);

// Route for image-only processing
router.route('/process-image').post(verifyJWT, processImageOnly);

export default router