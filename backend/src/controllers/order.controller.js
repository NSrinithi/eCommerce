import * as os from "../services/order.service.js";

export async function createOrder(req, res) {
    try {
        const userId = req.user.id;
        const address = req.body.address;
        const result = await os.createOrder(userId, address);
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export async function getOrders(req, res) {
    try {
        const userId = req.user.id;
        const result = await os.getOrders(userId);
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function getAllOrders(req, res) {
    try {
        const result = await os.getAllOrders();
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export async function getOrdersById(req, res) {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;
        const result = await os.getOrdersById(userId, orderId);
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export async function updateOrderStatus(req, res) {

    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await os.updateOrderStatus(
            id,
            status
        );

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}