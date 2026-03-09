import apiClient from "@/lib/apiClient";
import type { Cart, UpdateCartDTO, CartItemWithGame } from "@/types/Cart.types";
import { gameService } from "./game.service";
import { cartItemService } from "./cart-item.service";

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
    // New helper to get cart items with populated game data
    getMyCartWithItems: async (): Promise<{ cart: Cart; items: CartItemWithGame[] }> => {
        const cart = await cartService.getMyCart();
        
        if (!cart.itemId || cart.itemId.length === 0) {
            return { cart, items: [] };
        }

        // Fetch all cart items for this cart
        const cartItems = await cartItemService.getCartItemsByCartId(cart._id);
        
        // Fetch game details for each cart item
        const itemsWithGames = await Promise.all(
            cartItems.map(async (item) => {
                try {
                    const game = await gameService.getGameById(item.productId);
                    return { ...item, game } as CartItemWithGame;
                } catch (error) {
                    console.error(`Failed to fetch game ${item.productId}:`, error);
                    return null;
                }
            })
        );

        // Filter out null values (games that failed to load)
        const validItems = itemsWithGames.filter((item): item is CartItemWithGame => item !== null);
        
        return { cart, items: validItems };
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
