import * as cs from "../services/cart.service.js";

export async function addCart(req, res) {
    try {
        const userId=req.user.id;
        const productId=req.body.productId;
        const quantity=req.body.quantity;
        const result = await cs.addCart(userId, productId, quantity);
        res.status(201).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error
        })
    }

}

export async function getCart(req,res){
    try{
        const result=await cs.getCart(req.user.id);
        res.status(200).json({
            success:true,
            data:result
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error
        })
    }
}

export async function updateCart(req, res) {
    try {
        const userId=req.user.id;
        const productId=req.params.productId;
        const quantity=req.body.quantity;
        const result = await cs.updateCart(userId, productId, quantity);
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error
        })
    }

}

export async function deleteCartProduct(req, res) {
    try {
        const userId=req.user.id;
        const productId=req.params.productId;
        const result = await cs.deleteCartproduct(userId, productId);
        res.status(200).json({
            success:true,
            data:result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error
        })
    }

}