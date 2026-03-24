import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/service/orders.service";

export const useGetOrderById = (id: string | undefined, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => ordersService.getOrderById(id as string),
        enabled: !!id && enabled,
    });
};

