import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addInvoice } from "../controllers/invoice.controller.js";


const router = Router()

router.route('/add-invoice').post(verifyJWT,addInvoice)

export default router