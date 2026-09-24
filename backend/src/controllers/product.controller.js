import * as ps from "../services/product.service.js";
import { uploadImage } from "../services/cloudinary.service.js";
export async function getProducts(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const products = await ps.getProducts(page, limit);
        res.status(200).json({
            success: true,
            data: products.product,
            pagination: {
                page,
                limit,
                totalProduct: products.totalProducts,
                totalPages: Math.ceil(products.totalProducts / limit)
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function addProduct(req, res) {
    try {
        console.log("request:" + req);
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }
        const imageUrl = await uploadImage(req.file.path);

        const productData = {
            ...req.body,
            images: [imageUrl]
        };
        const product = await ps.addProduct(productData);
        res.status(201).json({
            success: true,
            data: product
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getProductById(req, res) {
    try {
        const product = await ps.getProductById(req.params.id);
        res.status(200).json({
            success: true,
            data: product
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function deleteProductById(req, res) {
    try {
        const product = await ps.deleteProductById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export async function updateProductById(req, res) {
    try {
        const productData = {
            ...req.body
        };

        // Only update image if a new image was uploaded
        if (req.file) {
            const imageUrl = await uploadImage(req.file.path);
            productData.images = [imageUrl];
        }

        const product = await ps.updateProductById(
            req.params.id,
            productData
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            data: product
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export async function searchProduct(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const product = await ps.searchProduct(req.query.search, req.query.category, req.query.minPrice, req.query.maxPrice, req.query.sort, page, limit);
        res.status(200).json({
            success: true,
            data: product,
            pagination: {
                page,
                limit,
                totalProduct: product.totalProducts,
                totalPages: Math.ceil(product.totalProducts / limit)
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}