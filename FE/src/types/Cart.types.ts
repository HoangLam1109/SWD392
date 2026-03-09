import type { Game } from './Game.types';

export interface Cart {
    _id: string;
    userId: string;
    itemId: string[]; // List of CartItem IDs
    created_at?: Date;
    updated_at?: Date;
}

export interface CartItem {
    _id: string;
    cartId: string;
    productId: string;
    priceAtPurchase: number;
    discount: number;
    created_at?: Date;
    updated_at?: Date;
}

// Extended type with populated game data for display
export interface CartItemWithGame extends CartItem {
    game: Game;
}

export type UpdateCartDTO = Partial<Omit<Cart, '_id' | 'userId'>>;
export type UpdateCartItemDTO = Partial<Omit<CartItem, '_id' | 'cartId'>>;
