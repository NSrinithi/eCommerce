import { Router } from "express";
import { createOrder,getOrders,getOrdersById,getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router=Router();

router.post("/",requireAuth,createOrder);
router.get("/",requireAuth,getOrders);
router.get("/all",requireAuth,getAllOrders);
router.get("/:orderId",requireAuth,getOrdersById);
router.patch("/:id/status",requireAuth,updateOrderStatus);
export default router;