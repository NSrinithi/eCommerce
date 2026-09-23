import { Cart } from "../models/Cart.js";
import * as ps from "../services/payment.service.js";
import * as os from "../services/order.service.js";

export async function createPaymentOrder(req, res) {
    try {
        const userId = req.user.id;

        const cart=await Cart.findOne({user:userId}).populate("items.product");
        const amount=cart.items.reduce((total,x)=>(x.product.discountPrice??x.product.price)*x.quantity+total,0);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }

        const paymentOrder = await ps.createOrder(amount);

        res.status(201).json({
            success: true,
            data: paymentOrder
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function verifyPayment(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            address
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature||
            !address?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment details are missing"
            });
        }

        const isValid = ps.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
        const userId = req.user.id;

        const order = await os.createOrder(
            userId,
            address,
            razorpay_payment_id
        );

        res.status(201).json({
            success: true,
            message: "Payment verified and order created successfully",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}