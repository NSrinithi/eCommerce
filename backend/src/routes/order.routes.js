import { Router } from "express";
import { createOrder,getOrders,getOrdersById } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router=Router();

router.post("/",requireAuth,createOrder);
router.get("/",requireAuth,getOrders);
router.get("/:orderId",requireAuth,getOrdersById);
export default router;