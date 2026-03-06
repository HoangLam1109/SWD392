import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";
import type { CartResponse } from "@/types/Cart.types";

export const useGetCart = () => {
    return useQuery<CartResponse, Error>({
        queryKey: ['cart'],
        queryFn: cartService.getCart,
    });
};
