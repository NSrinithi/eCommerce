import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";

export async function getDashboardStats() {
    const [
        totalProducts,
        totalUsers,
        totalOrders,
        revenueResult,
        recentOrders,
        lowStockProducts
    ] = await Promise.all([
        // Total products
        Product.countDocuments(),

        // Total users
        User.countDocuments(),

        // Total orders
        Order.countDocuments(),

        // Total revenue from successful payments
        Order.aggregate([
            {
                $match: {
                    "payment.status": "PAID"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]),

        // Latest 5 orders
        Order.find()
            .populate("user", "name email")
            .populate("items.product", "name images")
            .sort({ createdAt: -1 })
            .limit(5),

        // Products with stock <= 5
        Product.find({
            stock: { $lte: 5 }
        })
            .select("name brand stock images price discountPrice")
            .sort({ stock: 1 })
            .limit(10)
    ]);

    return {
        totalProducts,
        totalUsers,
        totalOrders,

        totalRevenue:
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0,

        recentOrders,

        lowStockProducts
    };
}