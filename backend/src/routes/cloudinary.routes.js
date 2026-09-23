import { Router } from "express";
import multer from "multer";
import { uploadProductImage } from "../controllers/cloudinary.controller.js";

const router=Router();

const upload=multer({
    dest:"uploads/",
})

router.post("/upload",upload.single("image"),uploadProductImage);

export default router;