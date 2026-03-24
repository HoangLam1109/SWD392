import apiClient from "@/lib/apiClient";
import type { CreatePaymentDTO, VNPayPayment, VNPayPaymentTransaction } from "@/types/Payment.types";

export const paymentService = {
    createPayment: async (payment: CreatePaymentDTO) => {
        const response = await apiClient.post('/payments', payment);
        return response.data;
    },
    createVnpayUrl: async (data: VNPayPayment) => {
        const response = await apiClient.post('/payments/vnpay/create-url', data);
        return response.data as { redirectUrl: string };
    },
    createVnpayPaymentTransaction: async (data: VNPayPaymentTransaction) => {
        const response = await apiClient.post('/payments/vnpay/create-deposit-url', data);
        return response.data as { redirectUrl: string };
    },
};