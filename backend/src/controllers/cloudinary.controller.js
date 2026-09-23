import fs from "fs";
import { uploadImage } from "../services/cloudinary.service.js";

export async function uploadProductImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const imageUrl = await uploadImage(req.file.path);

        // Delete temporary local file after Cloudinary upload
        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                imageUrl,
            },
        });
    } catch (error) {
        // Clean up temporary file if upload fails
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}