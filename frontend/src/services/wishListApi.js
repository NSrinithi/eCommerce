import { api } from "../lib/api";

export const wishListApi={
    add:(productId)=>api('/wishList',{
        method:"POST",
        data:productId
    }),
    get:()=>api('/wishList'),
    remove:(productId)=>api(`/wishList/${productId}`,{
        method:"DELETE"
    })
}