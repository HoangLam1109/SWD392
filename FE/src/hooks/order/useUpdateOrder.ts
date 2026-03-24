import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/service/orders.service";
import { toast } from "sonner";
import type { UpdateOrderDTO } from "@/types/Orders.types";

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOrderDTO }) =>
            ordersService.updateOrder(id, data),
        onSuccess: () => {
            toast.success("Order updated successfully");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
            toast.error(error?.response?.data?.message ?? error?.message ?? "Failed to update order");
        },
    });
};
