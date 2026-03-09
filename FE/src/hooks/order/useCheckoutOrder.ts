import { ordersService } from "@/service/orders.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCheckoutOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => ordersService.checkoutOrder(),
        onSuccess: () => {
            toast.success("Order checkout successfully");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: any) => {
            toast.error(error?.message ?? "Checkout failed");
        },
    });
};    