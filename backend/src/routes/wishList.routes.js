import { Router } from "express";
import { addWishList,getWishList,removeWishList } from "../controllers/wishList.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router=Router();

router.post("/",requireAuth,addWishList);
router.get("/",requireAuth,getWishList);
router.delete("/:id",requireAuth,removeWishList);

export default router;