import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";
import type { CartItemResponse } from "@/types/Cart.types";

export const useGetCartItems = (cartId: string | undefined) => {
    return useQuery<CartItemResponse[], Error>({
        queryKey: ['cart-items', cartId],
        queryFn: () => cartService.getCartItems(cartId as string),
        enabled: !!cartId, // Only fetch if cartId is available
    });
};
