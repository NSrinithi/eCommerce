import * as ws from "../services/wishList.service";

export async function addWishList(req, res) {
    const userId = req.user.id;
    const productId = req.body.productId;
    try {
        const wishList = await ws.addWishList(userId, productId);
        res.status(200).json({
            success: true,
            data:wishList
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export async function getWishList(req,res) {
    const userId = req.user.id;
    try {
        const wishList = await ws.getWishList(userId);
        res.status(200).json({
            success: true,
            data:wishList
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export async function removeWishList(req,res) {
    const userId = req.user.id;
    const productId=req.params.id;
    try {
        const wishList =await ws.removeWishList(userId,productId);
        res.status(200).json({
            success: true,
            data:wishList
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}