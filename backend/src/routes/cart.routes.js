import { Router } from "express";
import { addCart,getCart,updateCart,deleteCartProduct } from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router=Router();

router.post("/",requireAuth,addCart);
router.get("/",requireAuth,getCart);
router.put("/:productId",requireAuth,updateCart);
router.delete("/:productId",requireAuth,deleteCartProduct);

export default router;