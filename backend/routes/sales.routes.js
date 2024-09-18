import { Router } from "express";
import { addSale,getSales, getTotalProfitValueLast30Days, getTotalProfitValueOneDay, getTotalSalesValueAllTime, getTotalSalesValueLast30Days, getTotalSalesValueOneDay } from "../controllers/sales.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/add-sale').post(verifyJWT, addSale)
router.route('/get-sale').get(verifyJWT, getSales)
router.route('/get-total-oneday-sale').get(verifyJWT, getTotalSalesValueOneDay)
router.route('/get-total-last30Day-sale').get(verifyJWT, getTotalSalesValueLast30Days)
router.route('/get-total-allTime-sale').get(verifyJWT, getTotalSalesValueAllTime)
router.route('/get-total-one-profit').get(verifyJWT, getTotalProfitValueOneDay)
router.route('/get-total-last30Day-profit').get(verifyJWT, getTotalProfitValueLast30Days)

export default router