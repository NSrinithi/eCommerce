import { api } from "../lib/api";

export const paymentApi = {
    createPayment: () => api('/payment', {
        method: "POST"
    }),
    verifyPayment: (paymentData) =>
        api("/payment/verify", {
            method: "POST",
            data: paymentData
        })
}