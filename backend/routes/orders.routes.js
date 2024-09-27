import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addOrder, getOrders, getPendingOrder } from "../controllers/orders.controller.js";

const router = Router()

router.route('/add-order').post(verifyJWT,addOrder)
router.route('/get-order').get(verifyJWT,getOrders)
router.route('/get-pending-order').get(verifyJWT,getPendingOrder)

export default router