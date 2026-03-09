export interface Cart {
    _id: string;
    userId: string;
    itemId: string[]; // List of CartItem IDs
}

export interface CartItem {
    _id: string;
    cartId: string;
    productId: string;
    priceAtPurchase: number;
    discount: number;
}

export type UpdateCartDTO = Partial<Omit<Cart, '_id' | 'userId'>>;
export type UpdateCartItemDTO = Partial<Omit<CartItem, '_id' | 'cartId'>>;
