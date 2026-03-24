import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/service/orders.service";

export const useGetOrderByUserId = (userId: string | undefined, enabled: boolean = true) => {
    return useQuery({
        queryKey: ["orders", "user", userId],
        queryFn: () => ordersService.getOrderbyUserId(userId as string),
        enabled: !!userId && enabled,
    });
};
