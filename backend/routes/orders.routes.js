import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addOrder, getOrders } from "../controllers/orders.controller.js";

const router = Router()

router.route('/add-order').post(verifyJWT,addOrder)
router.route('/get-order').get(verifyJWT,getOrders)

export default router