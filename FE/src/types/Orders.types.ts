export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Order {
    _id: string;
    userId: string;
    walletTransactionId?: string;
    orderDetailId: string[];
    totalPrice: number;
    paymentStatus: PaymentStatus;
    completedAt?: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrderDetail {
    _id: string;
    orderId?: string;
    productId: string;
    priceAtPurchase: number;
    discount: number;
    orderType: 'Game' | 'DLC';
    created_at?: string;
    updated_at?: string;
}

export interface OrderCheckout {
    _id: string;
    userId: string;
    walletTransactionId: string;
    orderDetailId: string[];
    totalPrice: number;
    paymentStatus: PaymentStatus;
    created_at: string;
    updated_at: string;
    completedAt: string;
}

export interface UpdateOrderDTO {
    userId?: string;
    walletTransactionId?: string;
    orderDetailId?: string[];
    totalPrice?: number;
    paymentStatus?: PaymentStatus;
    completedAt?: string;
}

export interface CreateOrderDetailDTO {
    orderId: string;
    productId: string;
    priceAtPurchase: number;
    discount: number;
    orderType: 'Game' | 'DLC';
}

export interface UpdateOrderDetailDTO {
    orderId?: string;
    productId?: string;
    priceAtPurchase?: number;
    discount?: number;
    orderType?: 'Game' | 'DLC';
}

export interface OrdersResponse {
    data: Order[];
    totalCount: number;
    hasNextPage: boolean;
    nextCursor?: string;
}