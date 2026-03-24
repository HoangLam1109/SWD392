import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useGetCartById = (id: string) => {
    return useQuery({
        queryKey: ['cart', id],
        queryFn: () => cartService.getCartById(id),
        enabled: !!id,
    });
}
