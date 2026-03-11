import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/service/orders.service";
import type { OrdersResponse } from "@/types/Orders.types";

export const useGetOrders = (params?: { cursor?: string; pageSize?: number; search?: string }) => {
    return useQuery<OrdersResponse>({
        queryKey: ['orders', params],
        queryFn: () => ordersService.getOrders(params),
    });
};
