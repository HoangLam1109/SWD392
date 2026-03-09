import { useQuery } from "@tanstack/react-query";
import { cartItemService } from "@/service/cart-item.service";

export const useGetCartItems = () => {
    return useQuery({
        queryKey: ['cartItems'],
        queryFn: cartItemService.getCartItems,
    });
}
