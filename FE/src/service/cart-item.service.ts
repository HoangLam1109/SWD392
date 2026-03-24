import apiClient from "@/lib/apiClient";
import type { CartItem, UpdateCartItemDTO } from "@/types/Cart.types";

export const cartItemService = {
    getCartItems: async () => {
        const response = await apiClient.get('/cart-items');
        const body = response.data as { data?: CartItem[] } | CartItem[];
        return Array.isArray(body) ? body : (body?.data ?? []);
    },
    getCartItemsByCartId: async (cartId: string) => {
        const response = await apiClient.get(`/cart-items/cart/${cartId}`);
        const body = response.data as { data?: CartItem[] } | CartItem[];
        return Array.isArray(body) ? body : (body?.data ?? []);
    },
    getCartItemById: async (id: string) => {
        const response = await apiClient.get(`/cart-items/${id}`);
        return response.data as CartItem;
    },
    updateCartItem: async (id: string, data: UpdateCartItemDTO) => {
        const response = await apiClient.patch(`/cart-items/${id}`, data);
        return response.data as CartItem;
    },
    deleteCartItem: async (id: string) => {
        const response = await apiClient.delete(`/cart-items/${id}`);
        return response.data as CartItem;
    },
};
