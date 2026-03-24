import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useGetMyCartWithItems = () => {
    return useQuery({
        queryKey: ['myCart', 'withItems'],
        queryFn: cartService.getMyCartWithItems,
        staleTime: 1000 * 60, // Consider data fresh for 1 minute
    });
}
