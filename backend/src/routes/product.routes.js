import { Router } from "express";
import multer from "multer";
import { getProducts,addProduct,getProductById,deleteProductById,updateProductById,searchProduct } from "../controllers/product.controller.js";

const router=Router();

const upload=multer({
    dest:"uploads/",
})

router.get("/",getProducts);
router.get("/search",searchProduct);
router.post("/",upload.single("images"),addProduct);
router.get("/:id",getProductById);
router.delete("/:id",deleteProductById);

router.put("/:id",upload.single("images"),updateProductById);


export default router;