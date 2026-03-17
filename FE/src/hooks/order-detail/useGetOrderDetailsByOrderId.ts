import { useQuery } from "@tanstack/react-query";
import { orderDetailService } from "@/service/order-detail.service";
import type { OrderDetail } from "@/types/Orders.types";

export const useGetOrderDetailsByOrderId = (orderId: string | undefined) => {
    return useQuery<OrderDetail[]>({
        queryKey: ['order-details', 'order', orderId],
        queryFn: () => orderDetailService.getOrderDetailsByOrderId(orderId as string),
        enabled: !!orderId,
    });
};
