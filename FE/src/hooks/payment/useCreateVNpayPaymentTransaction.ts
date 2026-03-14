import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/service/payment.service";
import { toast } from "sonner";
import type { VNPayPaymentTransaction } from "@/types/Payment.types";

export const useCreateVNpayPaymentTransaction = () => {
    return useMutation<{ redirectUrl: string }, Error, VNPayPaymentTransaction>({
        mutationFn: (data:VNPayPaymentTransaction) => paymentService.createVnpayPaymentTransaction(data),
        onSuccess: (data) => {
            toast.success('VNPay payment transaction created successfully');
            return data.redirectUrl;
        },
        onError: (error: any) => {
            toast.error(error?.message ?? "Failed to create VNPay payment transaction");
        },
    });
};