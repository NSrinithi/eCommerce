import { api } from "../lib/api";

export const productApi = {
    list: (page = 1, limit = 5) =>
        api(`/products?page=${page}&limit=${limit}`),

    search: (params = {}) => {
        const query = new URLSearchParams();
        if (params.search) {
            query.append("search", params.search);
        }
        if (params.category) {
            query.append("category", params.category);
        }
        if (params.sort) {
            query.append("sort", params.sort);
        }
        if (params.minPrice) {
            query.append("minPrice", params.minPrice);
        }
        if (params.maxPrice) {
            query.append("maxPrice", params.maxPrice);
        }
        query.append("page", params.page || 1);
        query.append("limit", params.limit || 8);
        return api(`/products/search?${query.toString()}`)
    }
}