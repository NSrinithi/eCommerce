import { api } from "../lib/api";

export const orderApi={
    add:(address)=>api("/order",{
        method:"POST",
        data:{
            address
        }
    }),
    get:()=>api("/order"),
    getAll:()=>api("/order/all")
}