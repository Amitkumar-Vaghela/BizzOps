import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addOrder, getOrders, getPendingOrder,countTotalOrders, markDone } from "../controllers/orders.controller.js";

const router = Router()

router.route('/add-order').post(verifyJWT,addOrder)
router.route('/get-order').get(verifyJWT,getOrders)
router.route('/get-pending-order').get(verifyJWT,getPendingOrder)
router.route('/count-order').get(verifyJWT,countTotalOrders)
router.route('/markDone').get(verifyJWT,markDone)

export default router