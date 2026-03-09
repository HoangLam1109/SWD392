import apiClient from "@/lib/apiClient";
import type { Cart, UpdateCartDTO } from "@/types/Cart.types";

export const cartService = {
    getCarts: async () => {
        const response = await apiClient.get('/carts');
        const body = response.data as { data?: Cart[] } | Cart[];
        return Array.isArray(body) ? body : (body?.data ?? []);
    },
    getMyCart: async () => {
        const response = await apiClient.get('/carts/me');
        return response.data as Cart;
    },
    addGameToCart: async (productId: string) => {
        const response = await apiClient.patch(`/carts/me/add/${productId}`);
        return response.data as Cart;
    },
    removeGameFromCart: async (productId: string) => {
        const response = await apiClient.patch(`/carts/me/remove/${productId}`);
        return response.data as Cart;
    },
    clearCart: async () => {
        const response = await apiClient.patch('/carts/me/clear');
        return response.data as Cart;
    },
    getCartById: async (id: string) => {
        const response = await apiClient.get(`/carts/${id}`);
        return response.data as Cart;
    },
    updateCart: async (id: string, data: UpdateCartDTO) => {
        const response = await apiClient.patch(`/carts/${id}`, data);
        return response.data as Cart;
    },
    deleteCart: async (id: string) => {
        const response = await apiClient.delete(`/carts/${id}`);
        return response.data as Cart;
    },
};
