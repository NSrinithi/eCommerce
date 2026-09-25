import { WishList } from "../models/WishList.js";
import { Product } from "../models/Product.js";

export async function addWishList(userId, productId) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    // Find wishlist and add product
    const wishList = await WishList.findOneAndUpdate(
        { user: userId },
        {
            $addToSet: {
                products: productId
            }
        },
        {
            new: true,
            upsert: true
        }
    ).populate("products");

    return wishList;
}


export async function getWishList(userId) {
    const wishlist = await WishList.findOne({
        user: userId
    })
    return wishlist;
}


export async function removeWishList(userId, productId) {
    const wishlist = await WishList.findOneAndUpdate(
        { user: userId },
        {
            $pull: {
                products: productId
            }
        },
        {
            new: true
        }
    );
    return wishlist;
}
