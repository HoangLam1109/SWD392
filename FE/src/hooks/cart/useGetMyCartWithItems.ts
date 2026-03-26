import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useGetMyCartWithItems = () => {
    return useQuery({
        queryKey: ['myCart', 'withItems'],
        queryFn: cartService.getMyCartWithItems,
        enabled: Boolean(localStorage.getItem('token')),
        staleTime: 1000 * 60,
    });
}
