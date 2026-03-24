import { ordersService } from "@/service/orders.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { Order } from "@/types/Orders.types";

type ApiErrorData = {
    message?: string | string[];
};

function getApiErrorMessage(error: unknown): string {
    const axiosError = error as AxiosError<ApiErrorData>;
    const message = axiosError?.response?.data?.message;

    if (Array.isArray(message)) {
        return message[0] ?? "Checkout failed";
    }

    if (typeof message === "string" && message.trim().length > 0) {
        return message;
    }

    if (error instanceof Error && error.message.trim().length > 0) {
        return error.message;
    }

    return "Checkout failed";
}

export const useCheckoutOrder = () => {
    const queryClient = useQueryClient();

    return useMutation<Order, unknown>({
        mutationFn: () => ordersService.checkoutOrder(),
        onSuccess: () => {
            toast.success("Order checkout successfully");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};    