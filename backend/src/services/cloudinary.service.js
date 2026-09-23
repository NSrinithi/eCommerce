import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export async function uploadImage(filePath){
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "ecommerce-products"
        });

        return result.secure_url;

    } finally {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}