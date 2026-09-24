import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { AppError } from "../utils/AppError.js";

export async function createOrder(userId, address, paymentId) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        throw new AppError(404, "Cart not found", "CART_NOT_FOUND");
    }
    else {
        for (const item of cart.items) {

            if (!item.product) {
                throw new AppError(
                    404,
                    "Product not found",
                    "PRODUCT_NOT_FOUND"
                );
            }

            if (item.quantity > item.product.stock) {
                throw new AppError(
                    400,
                    `Only ${item.product.stock} units of ${item.product.name} are available`,
                    "INSUFFICIENT_STOCK"
                );
            }
        }
        const orderItems = cart.items.map(x => ({
            product: x.product._id,
            quantity: x.quantity,
            price: x.product.discountPrice ?? x.product.price
        }))

        for (const item of cart.items) {

            await Product.findByIdAndUpdate(
                item.product._id,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                },
                {
                    new: true
                }
            );
        }

        const totalAmount = orderItems.reduce((total, items) => total + items.price * items.quantity, 0)
        const order = await Order.create({
            user: cart.user,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: address,
            status: "PLACED",
            payment: {
                status: "PAID",
                paymentId: paymentId
            }
        })
        await Cart.findOneAndDelete({ user: userId });
        return order;
    }
}

export async function getOrders(userId) {
    const orders = await Order.find({ user: userId }).populate("items.product").populate("user");
    console.log(orders);
    if (orders.length === 0) {
        throw new AppError(404, "orders not found", "ORDER_NOT_FOUND");
    } else {
        return orders;
    }
}

export async function getOrdersById(userId, orderId) {
    const orders = await Order.findOne({ _id: orderId, user: userId });
    if (!orders) {
        throw new AppError(404, "orders not found", "ORDER_NOT_FOUND");
    } else {
        return orders;
    }
}

export async function getAllOrders() {
    const orders = await Order.find().populate("items.product");
    if (orders.length === 0) {
        throw new AppError(404, "orders not found", "ORDER_NOT_FOUND");
    } else {
        return orders;
    }
}