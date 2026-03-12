export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export interface Order {
    userId: string;
    walletTransactionId: string;
    orderDetailId: string[];
    totalPrice: number;
    paymentStatus: PaymentStatus;
    completedAt?: string;
}
export interface OrderCheckout{
        _id:string,
        userId:string,
        walletTransactionId:string,
        orderDetailId:string[],
        totalPrice:number,
        paymentStatus:PaymentStatus,
        created_at:string,
        updated_at:string,
        completedAt:string
}