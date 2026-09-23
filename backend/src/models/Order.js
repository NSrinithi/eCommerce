import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true
        }
    }],
    totalAmount:{
        type:Number,
        required:true
    },
    shippingAddress:{
        type:String,
        required:true
    }
    ,status:{
        type:String,
        required:true,
        default: "PLACED"

    },
    payment: {
        status: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING"
        },
        paymentId: {
            type: String
        }
    }
},{
    timestamps:true
})

export const Order=mongoose.model("Order",orderSchema);