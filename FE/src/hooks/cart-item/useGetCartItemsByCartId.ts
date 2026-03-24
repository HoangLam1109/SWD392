import { useQuery } from "@tanstack/react-query";
import { cartItemService } from "@/service/cart-item.service";

export const useGetCartItemsByCartId = (cartId: string) => {
    return useQuery({
        queryKey: ['cartItems', { cartId }],
        queryFn: () => cartItemService.getCartItemsByCartId(cartId),
        enabled: !!cartId,
    });
}
