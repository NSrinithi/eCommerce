import { Router } from "express";
import { createPaymentOrder,verifyPayment } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router=Router();

router.post("/",requireAuth,createPaymentOrder);
router.post("/verify",requireAuth,verifyPayment);

export default router;