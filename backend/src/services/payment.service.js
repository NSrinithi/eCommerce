import { razorpay } from "../config/razorpay.js";
import crypto from "crypto"
export async function createOrder(amount) {
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    }
    return await razorpay.orders.create(options);
}

export function verifyPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === razorpaySignature;
}