import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/service/orders.service";
import { toast } from "sonner";

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ordersService.cancelOrder(id),
        onSuccess: () => {
            toast.success("Order cancelled");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: any) => {
            toast.error(error?.message ?? "Failed to cancel order");
        },
    });
};

