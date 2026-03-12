import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useGetMyCart = () => {
    return useQuery({
        queryKey: ['myCart'],
        queryFn: cartService.getMyCart,
    });
}
