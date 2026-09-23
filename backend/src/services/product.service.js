import { Product } from "../models/Product.js";

export async function getProducts(page, limit) {
    const skip = (page - 1) * limit;

    const product = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    return { product, totalProducts };
}

export async function addProduct(data) {
    const product = await Product.create(data);
    return product;
}

export async function getProductById(id) {
    const product = await Product.findById(id);
    return product;
}

export async function deleteProductById(id) {
    return await Product.findByIdAndDelete(id);
}

export async function updateProductById(id, data) {
    return await Product.findByIdAndUpdate(id,
        data, {
        new: true,
        runValidators: true
    });
}


export async function searchProduct(search, category, minPrice, maxPrice,sort,page,limit) {
    const query = {};
    let sortOption={}
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ]
    }
    if (category) {
        query.category = { $regex: category, $options: "i" };
    }
    if (minPrice !== undefined) {
        query.price = {
            $gte: Number(minPrice)
        };
    }
    if (maxPrice !== undefined) {
        query.price = {
            ...query.price, $lte: Number(maxPrice) };
    }
    if(sort==="price_asc"){
        sortOption={price:1};
    }
    if(sort==="price_desc"){
        sortOption={price:-1};
    }
    if(sort==="rating"){
        sortOption={rating:-1};
    }
    if(sort==="newest"){
        sortOption={createdAt:-1};
    }

    const skip = (page - 1) * limit;

    const product = await Product.find(query).sort(sortOption).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    return { product, totalProducts };
}