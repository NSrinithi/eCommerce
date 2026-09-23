import { api } from "../lib/api";

export const cartApi={
    add:(productId,quantity=1)=>api('/cart',{
        method:"POST",
        data:{
            productId,
            quantity
        }
    }),
    get:()=>api('/cart'),
    update:(productId,quantity)=>api(`/cart/${productId}`,{
        method:"PUT",
        data:{
            quantity
        }
    }),
    remove:(productId)=>api(`/cart/${productId}`,{
        method:"DELETE"
    })
}