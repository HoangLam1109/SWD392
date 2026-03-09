import { useQuery } from "@tanstack/react-query";
import { cartItemService } from "@/service/cart-item.service";

export const useGetCartItemById = (id: string) => {
    return useQuery({
        queryKey: ['cartItem', id],
        queryFn: () => cartItemService.getCartItemById(id),
        enabled: !!id,
    });
}
