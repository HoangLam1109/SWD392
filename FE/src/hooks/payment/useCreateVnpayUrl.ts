import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/service/payment.service";
import { toast } from "sonner";
import type { VNPayPayment } from "@/types/Payment.types";

export const useCreateVnpayUrl = () => {
    return useMutation<{ redirectUrl: string }, Error, VNPayPayment>({
        mutationFn: (data:VNPayPayment) => paymentService.createVnpayUrl(data),
        onSuccess: (data) => {
            toast.success('VNPay payment URL created successfully');
            return data.redirectUrl;
        },
        onError: (error: any) => {
            toast.error(error?.message ?? "Failed to create VNPay payment URL");
        },
    });
};  