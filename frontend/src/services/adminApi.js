import { api } from "../lib/api";

export const adminApi = {
    getDashboard: () => api('/admin/dashboard'),

    getProducts: (page = 1, limit = 20) =>
        api(`/products?page=${page}&limit=${limit}`),

    addProduct: (formData) =>
        api("/products", {
            method: "POST",
            data: formData,
        }),

    updateProduct: (id, formData) =>
        api(`/products/${id}`, {
            method: "PUT",
            data: formData,
        }),
    getProductById:(id)=>api(`/products/${id}`),
    deleteProduct: (id) =>
        api(`/products/${id}`, {
            method: "DELETE",
        }),
};