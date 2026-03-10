export interface CreatePaymentDTO {
    userId: string;
    transactionId: string;
    transactionCode: string;
    paymentMethod: string;
}
export interface VNPayPayment{
    orderId:string;
    totalPrice:number;
}