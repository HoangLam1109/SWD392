import apiClient from "@/lib/apiClient";
import type { CartResponse, CartItemResponse } from "@/types/Cart.types";

export const cartService = {
    getCart: async () => {
        const response = await apiClient.get('/carts/me');
        return response.data as CartResponse;
    },
    getCartItems: async (cartId: string) => {
        const response = await apiClient.get(`/cart-items/cart/${cartId}`);
        return response.data as CartItemResponse[];
    },
    addToCart: async (gameId: string) => {
        const response = await apiClient.patch(`/carts/me/add/${gameId}`);
        return response.data as CartResponse;
    },
    removeFromCart: async (gameId: string) => {
        const response = await apiClient.patch(`/carts/me/remove/${gameId}`);
        return response.data as CartResponse;
    },
    clearCart: async () => {
        const response = await apiClient.patch('/carts/me/clear');
        return response.data as CartResponse;
    }
};
