import { Router } from "express";
import { addSale,getSales } from "../controllers/sales.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/add-sale').post(verifyJWT, addSale)
router.route('/get-sale').get(verifyJWT, getSales)

export default router