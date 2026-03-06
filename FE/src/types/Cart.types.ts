export interface CartResponse {
    _id: string;
    userId: string;
    itemId: string[];
    created_at: string;
    updated_at: string;
}

export interface CartItemResponse {
    _id: string;
    cartId: string;
    gameId: string;
    priceAtPurchase: number;
    created_at: string;
    updated_at: string;
}

export interface CartUIData {
    id: string; // CartItem ID
    gameId: string;
    title: string;
    coverImage: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category?: string;
    developer?: string;
}
