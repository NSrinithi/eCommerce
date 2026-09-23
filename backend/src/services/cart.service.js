import { Cart } from "../models/Cart.js";
import { AppError } from "../utils/AppError.js";

export async function addCart(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        return await Cart.create({
            user: userId,
            items: [{
                product: productId,
                quantity: quantity
            }]
        });
    }
    const existingProduct = cart.items.find(x => x.product.toString() === productId);
    if (!existingProduct) {
        cart.items.push({ product: productId, quantity: quantity });
    } else {
        existingProduct.quantity += quantity;

    }
    return await cart.save();

}

export async function getCart(userId) {
    const carts = await Cart.findOne({ user: userId }).populate("items.product");
    return carts;
}

export async function updateCart(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (quantity < 1 || !quantity) {
        throw new AppError(400, "Quantity must be greater than or equal to 1", "INVALID_QUANTITY")
    }
    if (!cart) {
        throw new AppError(404, "Cart not found", "CART_NOT_FOUND");
    }
    const existingProduct = cart.items.find(x => x.product.toString() === productId);
    if (!existingProduct) {
        throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    } else {
        existingProduct.quantity = quantity;
    }
    return await cart.save();

}

export async function deleteCartproduct(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppError(404, "Cart not found", "CART_NOT_FOUND");
    }
    const existingProduct = cart.items.find(x => x.product.toString() === productId);
    if (!existingProduct) {
        throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
    } else {
        cart.items.remove(existingProduct);
    }
    return await cart.save();

}

