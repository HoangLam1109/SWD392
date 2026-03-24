import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/service/orders.service";
import type { Order } from "@/types/Orders.types";

export const useGetOrdersByUserId = (userId: string | undefined) => {
    return useQuery<Order[]>({
        queryKey: ['orders', 'user', userId],
        queryFn: () => ordersService.getOrdersByUserId(userId as string),
        enabled: !!userId,
    });
};
