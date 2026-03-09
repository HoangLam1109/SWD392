import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useGetCarts = () => {
    return useQuery({
        queryKey: ['carts'],
        queryFn: cartService.getCarts,
    });
}
