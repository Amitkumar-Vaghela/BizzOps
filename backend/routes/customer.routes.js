import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addCustomer, getCustomer } from "../controllers/customer.controller.js";

const router = Router()

router.route('/add-customer').post(verifyJWT,addCustomer)
router.route('/get-customer').get(verifyJWT,getCustomer)


export default router